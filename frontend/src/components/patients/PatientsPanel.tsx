import React, { useMemo, useState } from "react";
import { Card, Table, Button, Space, Input, Select, Drawer, Form, Row, Col, Switch, theme, Checkbox, Divider } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, StopOutlined } from "@ant-design/icons";
import { Patient, usePatients } from "@/hooks/queries/usePatients";

const { Option } = Select;

const epsHospitals: Record<string, string[]> = {
    Sura: ["Clínica Medellín", "Clínica Las Américas", "Hospital Pablo Tobón"],
    Sanitas: ["Clínica Colsanitas", "Clínica Reina Sofía"],
    NuevaEPS: ["Hospital Simón Bolívar", "Hospital Kennedy"],
    Compensar: ["Clínica Compensar Calle 94", "Compensar Av 68"]
};

const PatientsManagementPanel: React.FC = () => {
    const page = 1;
    const { token } = theme.useToken();

    const [searchField, setSearchField] = useState<keyof Patient>("dni");
    const [searchValue, setSearchValue] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState<Patient | null>(null);
    const [selectedEps, setSelectedEps] = useState<string | null>(null);

    const [form] = Form.useForm();

    const patients = usePatients(page);

    const filteredData = useMemo(() => {
        const list: Patient[] = patients.data || [];

        if (!searchValue) return list;

        return list.filter(item => item[searchField]?.toString().toLowerCase().includes(searchValue.toLowerCase()));
    }, [patients.data, searchField, searchValue]);

    const openDrawer = (record?: Patient) => {
        if (record) {
            setSelected(record);
            form.setFieldsValue({
                ...record,
                identification: record.dni,
                firstName: record.first_name,
                lastName: record.last_name
            });
        } else {
            setSelected(null);
            form.resetFields();
        }

        setDrawerOpen(true);
    };

    const handleSave = async () => {
        const values = await form.validateFields();

        console.log("values", values);

        setDrawerOpen(false);
    };

    const toggleActive = (id: string) => {
        console.log("toggle", id);
    };

    const columns = [
        {
            title: "DNI",
            dataIndex: "dni",
            width: 140
        },
        {
            title: "Name",
            width: 220,
            render: (_: any, record: Patient) => `${record.first_name} ${record.last_name}`
        },
        {
            title: "Phone",
            dataIndex: "phone",
            width: 150
        },
        {
            title: "",
            width: 120,
            render: (_: any, record: Patient) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => openDrawer(record)} />
                    <Button icon={<StopOutlined />} size="small" danger onClick={() => toggleActive(record._id)} />
                </Space>
            )
        }
    ];

    return (
        <Card title="Patient Management" style={{ background: token.colorBgContainer }}>
            {/* SEARCH */}
            <Card
                size="small"
                style={{
                    marginBottom: 16,
                    background: token.colorBgElevated
                }}
            >
                <Space>
                    <Select value={searchField} onChange={setSearchField} style={{ width: 180 }}>
                        <Option value="dni">DNI</Option>
                        <Option value="first_name">First Name</Option>
                        <Option value="last_name">Last Name</Option>
                    </Select>

                    <Input placeholder="Search..." value={searchValue} onChange={e => setSearchValue(e.target.value)} style={{ width: 220 }} />

                    <Button icon={<SearchOutlined />} />

                    <Button color="default" variant="outlined"icon={<PlusOutlined />} onClick={() => openDrawer()}>
                        New Patient
                    </Button>
                </Space>
            </Card>

            {/* TABLE */}

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="_id"
                loading={patients.isLoading}
                pagination={{ pageSize: 5 }}
                scroll={{ y: 320 }}
                size="small"
            />

            {/* DRAWER */}

            <Drawer
                title={selected ? "Edit Patient" : "New Patient"}
                placement="right"
                width={520}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                extra={
                    <Button type="primary" onClick={handleSave}>
                        Save
                    </Button>
                }
            >
                <Form layout="vertical" form={form}>
                    <Divider>Basic Information</Divider>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name="dni" label="DNI" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="phone" label="Phone">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="address" label="Address">
                        <Input />
                    </Form.Item>

                    <Divider>Insurance & Hospitals</Divider>

                    <Form.Item name="eps" label="Health Insurance (EPS)">
                        <Select
                            onChange={value => {
                                setSelectedEps(value);
                                form.setFieldValue("assignedHospitals", []);
                            }}
                        >
                            {Object.keys(epsHospitals).map(eps => (
                                <Option key={eps} value={eps}>
                                    {eps}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedEps && (
                        <Form.Item name="assignedHospitals" label="Authorized Hospitals">
                            <Checkbox.Group style={{ width: "100%" }}>
                                <Row>
                                    {epsHospitals[selectedEps].map(hospital => (
                                        <Col span={24} key={hospital}>
                                            <Checkbox value={hospital}>{hospital}</Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    )}

                    <Divider />

                    <Form.Item name="active" label="Active in System" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Drawer>
        </Card>
    );
};

export default PatientsManagementPanel;
