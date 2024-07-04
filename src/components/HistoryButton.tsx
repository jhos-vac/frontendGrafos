import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import styles from '../estilos/components.module.css';
import { getHistory, ViewData } from "../resources/resource";
import HistoryList from "./HistoryList";

const HistoryButton: React.FC<{ onView: (data: any) => void }> = ({ onView }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const [historyData, setHistoryData] = useState<any[]>([]);

    const showModal = async () => {
        try {
            const response = await ViewData(getHistory);
            console.log(response);
            setHistoryData(response);
            setOpen(true);
        } catch (error) {
            console.error('Error getting history:', error);
        }
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const handleView = (data: any) => {
        onView(data);
        setOpen(false);
    };

    return (
        <>
            <Button className={styles.Button} type="primary" onClick={showModal}>
                History
            </Button>
            <Modal
                title="History"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <HistoryList data={historyData} onView={handleView} />
            </Modal>
        </>
    );
};

export default HistoryButton;
