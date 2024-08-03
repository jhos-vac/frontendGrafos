import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Modal, Card } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { getHistory, ViewData } from "../resources/resource";
import GraphDisplay from './GraphDisplay';

interface DataType {
    id: number;
    nameStudent: string;
    context: string;
    studentLevel: string;
    calification: string;
    graphId?: string;
}

const truncateText = (text: string, length: number) => {
    if (text.length <= length) {
        return text;
    }
    return text.slice(0, length) + '...';
};

const extractCalification = (text: string) => {
    const matches = text.match(/\d+\/\d+/g);
    return matches ? matches[matches.length - 1] : '';
};

const processText = (text: string) => {
    const sections = text.split('\n\n');
    return sections.map((section, index) => {
        if (section.startsWith('### ')) {
            return <h3 key={index}>{section.substring(4)}</h3>;
        } else if (section.startsWith('**')) {
            const boldText = section.substring(2, section.length - 2);
            return <p key={index}><strong>{boldText}</strong></p>;
        } else if (section.startsWith('1.')) {
            const lines = section.split('\n').map((line, lineIndex) => {
                if (line.startsWith('   -')) {
                    return <li key={lineIndex}>{line.substring(5)}</li>;
                }
                return <p key={lineIndex}>{line}</p>;
            });
            return <div key={index}>{lines}</div>;
        } else {
            return <p key={index}>{section}</p>;
        }
    });
};

const List: React.FC<{ refresh: boolean }> = ({ refresh }) => {
    const [data, setData] = useState<DataType[]>([]);
    const [visibleDescription, setVisibleDescription] = useState<boolean>(false);
    const [visibleGraph, setVisibleGraph] = useState<boolean>(false);
    const [visibleContext, setVisibleContext] = useState<boolean>(false);
    const [processedDescription, setProcessedDescription] = useState<JSX.Element[] | null>(null);
    const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
    const [selectedGraphId, setSelectedGraphId] = useState<string | null>(null);
    const [selectedContext, setSelectedContext] = useState<string | null>(null);

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'nameStudent',
            key: 'nameStudent',
            render: (text: string) => truncateText(text, 10),
        },

        {
            title: 'Student Level',
            dataIndex: 'studentLevel',
            key: 'studentLevel',
            render: (studentLevel: string) => {
                let color = '';
                switch (studentLevel) {
                    case 'A1':
                        color = 'green';
                        break;
                    case 'A2':
                        color = 'blue';
                        break;
                    default:
                        color = 'geekblue';
                }
                return (
                    <Tag color={color} key={studentLevel}>
                        {studentLevel.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Calification',
            dataIndex: 'calification',
            key: 'calification',
            render: (text: string) => extractCalification(text),
        },
        {
            title: 'Description',
            dataIndex: '',
            key: 'description',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => showDescription(record.calification)}>View</a>
                </Space>
            ),
        },
        {
            title: 'Graph',
            dataIndex: '',
            key: 'graph',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => showGraph(record.graphId)}>View</a>
                </Space>
            ),
        },
        {
            title: 'Context',
            dataIndex: '',
            key: 'context',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => showContext(record.context)}>View</a>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await ViewData(getHistory);
                const sortedData = result.reverse();
                setData(sortedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refresh]);

    const showDescription = (description: string) => {
        setSelectedDescription(description);
        setProcessedDescription(processText(description));
        setVisibleDescription(true);
    };

    const showGraph = (graphId: string | undefined) => {
        if (graphId) {
            setSelectedGraphId(graphId);
            setVisibleGraph(true);
        }
    };

    const showContext = (context: string) => {
        setSelectedContext(context);
        setVisibleContext(true);
    };

    const handleCancelDescription = () => {
        setVisibleDescription(false);
        setSelectedDescription(null);
    };

    const handleCancelGraph = () => {
        setVisibleGraph(false);
        setSelectedGraphId(null);
    };

    const handleCancelContext = () => {
        setVisibleContext(false);
        setSelectedContext(null);
    };

    return (
        <div style={{ margin: "5%" }}>
            <div style={{ overflowX: 'auto', background:"white" }}>
                <Table columns={columns} dataSource={data} />
            </div>
            <Modal
                visible={visibleDescription}
                title="Description"
                onCancel={handleCancelDescription}
                footer={null}
                width={1000}
            >
                <Card>
                    {processedDescription}
                </Card>
            </Modal>
            <Modal
                visible={visibleGraph}
                title="Graph"
                onCancel={handleCancelGraph}
                footer={null}
                width={1300}
            >
                {selectedGraphId && <GraphDisplay graphId={selectedGraphId} />}
            </Modal>
            <Modal
                visible={visibleContext}
                title="Context"
                onCancel={handleCancelContext}
                footer={null}
                width={1000}
            >
                <Card>
                    <p>{selectedContext}</p>
                </Card>
            </Modal>
        </div>
    );
};

export default List;
