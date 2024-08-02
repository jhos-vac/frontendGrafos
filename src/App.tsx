import React, { useState, useEffect } from 'react';
import { Layout, Spin } from 'antd';
import './App.css';
import FormStudent from "./components/FormStudent";
import styles from './estilos/components.module.css';
import List from "./components/List";

const { Header, Content } = Layout;

const App: React.FC = () => {
    const [selectedData, setSelectedData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshList, setRefreshList] = useState<boolean>(false);


    const handleFormFinish = () => {
        setRefreshList((prev) => !prev);
    };

    return (
        <Layout className={styles.Layout}>
            {loading ? (
                <div className={styles.loadingContainer}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <FormStudent selectedData={selectedData} setLoading={setLoading} onFinish={handleFormFinish} />
                    <List refresh={refreshList} />
                </>
            )}
        </Layout>
    );
}

export default App;
