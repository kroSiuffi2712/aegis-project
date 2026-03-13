import { Flex, Typography } from "antd";
import "../../styles/chat-welcome.css";
import { Sparkles } from "lucide-react";

const { Title, Text, Paragraph } = Typography;

interface ChatWelcomeProps {
    name: string;
}

export const ChatWelcome = ({ name }: ChatWelcomeProps) => {
    return (
        <Flex align="center" gap={10}>
            <div>
                <Text type="secondary" style={{ fontSize: 16 }}>
                    Hi {name}
                </Text>

                <Title level={2} style={{ margin: 0, fontWeight: 500 }}>
                    What incident information would you like to explore?
                </Title>
            </div>
        </Flex>
    );
};
