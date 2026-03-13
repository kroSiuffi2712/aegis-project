import React, { useMemo, useState } from "react";
import { Card, Table, Button, Space, Input, Select, Drawer, Form, Row, Col, Tag, theme, Divider } from "antd";

import { PlusOutlined, SearchOutlined, EditOutlined, StopOutlined } from "@ant-design/icons";

import { Provider, useProviders } from "@/hooks/queries/useProvider";
import { useAmbulances } from "@/hooks/queries/useAmbulances";
import { Ambulance } from "@/types/ambulanceMapMarker";

const { Option } = Select;

const AmbulancePanel: React.FC = () => {
    const page = 1;
    const { token } = theme.useToken();

    const [searchField, setSearchField] = useState("plate");
    const [searchValue, setSearchValue] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState<Ambulance | null>(null);

    const [form] = Form.useForm();

    const providers = useProviders(page);
    const ambulances = useAmbulances();

    /* ---------------- FILTER ---------------- */

    const filteredData = useMemo(() => {
        const list = ambulances?.data?.data || [];

        if (!searchValue) return list;

        return list.filter(item => item[searchField as keyof Ambulance]?.toString().toLowerCase().includes(searchValue.toLowerCase()));
    }, [ambulances?.data?.data, searchField, searchValue]);

    /* ---------------- DRAWER ---------------- */

    const openDrawer = (record?: Ambulance) => {
        if (record) {
            setSelected(record);

            form.setFieldsValue({
                plate: record.plate,
                provider_id: record.company?._id,
                status: record.status,
                driver_name: record.driver_name,
                lat: record.location?.coordinates?.[1],
                lng: record.location?.coordinates?.[0]
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

    /* ---------------- TABLE ---------------- */

    const columns = [
        {
            title: "Plate",
            dataIndex: "plate",
            width: 120
        },
        {
            title: "Provider",
            dataIndex: ["company", "name"],
            width: 200,
            ellipsis: true
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 130,
            render: (status: string) => {
                const color = status === "available" ? "green" : status === "on_route" ? "blue" : status === "unavailable" ? "red" : "default";

                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: "Driver",
            dataIndex: "driver_name",
            width: 180
        },
        {
            title: "",
            width: 120,
            render: (_: any, record: Ambulance) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => openDrawer(record)} />
                    <Button icon={<StopOutlined />} size="small" danger onClick={() => toggleActive(record._id)} />
                </Space>
            )
        }
    ];

    return (
        <Card title="Ambulance Management" style={{ background: token.colorBgContainer }}>
            {/* SEARCH */}

            <Card
                size="small"
                style={{
                    marginBottom: 16,
                    background: token.colorBgElevated
                }}
            >
                <Space>
                    <Select value={searchField} onChange={setSearchField} style={{ width: 160 }}>
                        <Option value="plate">Plate</Option>
                        <Option value="driver_name">Driver</Option>
                        <Option value="status">Status</Option>
                    </Select>

                    <Input placeholder="Search..." value={searchValue} onChange={e => setSearchValue(e.target.value)} style={{ width: 220 }} />

                    <Button icon={<SearchOutlined />} />

                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openDrawer()} color="default" variant="outlined">
                        New Ambulance
                    </Button>
                </Space>
            </Card>

            {/* TABLE */}

            <Table columns={columns} dataSource={filteredData} rowKey="_id" pagination={{ pageSize: 5 }} scroll={{ y: 320 }} size="small" />

            {/* DRAWER */}

            <Drawer
                title={selected ? "Edit Ambulance" : "New Ambulance"}
                width={480}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                extra={
                    <Button type="primary" onClick={handleSave} variant="outlined">
                        Save
                    </Button>
                }
            >
                <Divider>Ambulance Details</Divider>

                <Form layout="vertical" form={form}>
                    <Form.Item name="provider_id" label="Provider">
                        <Select loading={providers.isLoading} placeholder="Select provider">
                            {providers?.data?.map((provider: Provider) => (
                                <Option key={provider.id} value={provider.id}>
                                    {provider.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="status" label="Operational Status">
                        <Select placeholder="Select Status">
                            <Option value="available">Available</Option>
                            <Option value="on_route">On Route</Option>
                            <Option value="unavailable">Unavailable</Option>
                        </Select>
                    </Form.Item>

                    <Row gutter={12}>
                        <Col span={24}>
                            <Form.Item name="driver_name" label="Driver Name">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Geolocation</Divider>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name="lat" label="Lat">
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="lng" label="Lng">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </Card>
    );
};

export default AmbulancePanel;
