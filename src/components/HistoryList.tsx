import React from 'react';
import { Space, Table } from 'antd';
import type { TableProps } from 'antd';

type ColumnsType<T extends object> = TableProps<T>['columns'];

interface DataType {
    id: number;
    nameStudent: string;
    context: string;
    studentLevel: string;
    calification: string;
}
const truncateText = (text: string, length: number) => {
    if (text.length <= length) {
        return text;
    }
    return text.slice(0, length) + '...';
};

const columns = (handleView: (data: DataType) => void): ColumnsType<DataType> => [
    {
        title: 'Name',
        dataIndex: 'nameStudent',
        key: 'nameStudent',
        render: (text: string) => truncateText(text, 10),
    },
    {
        title: 'Level',
        dataIndex: 'studentLevel',
        key: 'studentLevel',
    },
    {
        title: 'Calification',
        dataIndex: 'calification',
        key: 'calification',
        render: (text: string) => truncateText(text, 10),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a onClick={() => handleView(record)}>View</a>
            </Space>
        ),
    },
];

const HistoryList: React.FC<{ data: DataType[], onView: (data: DataType) => void }> = ({ data, onView }) => {
    return (
        <div>
            <Table columns={columns(onView)} dataSource={data} rowKey="id" />
        </div>
    );
};

export default HistoryList;
