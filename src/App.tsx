import React, { useState, useEffect } from 'react';
import { Layout, Progress } from 'antd';
import './App.css';
import FormStudent from "./components/FormStudent";
import styles from './estilos/components.module.css';
import List from "./components/List";

const { Header, Content } = Layout;

const App: React.FC = () => {
    const [selectedData, setSelectedData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshList, setRefreshList] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        if (loading) {
            setProgress(0);

            const interval = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prevProgress + 5;
                });
            }, 500);

            return () => {
                clearInterval(interval);
            };
        }
    }, [loading]);

    const handleFormFinish = () => {
        setRefreshList((prev) => !prev);
    };

    return (
        <Layout className={styles.Layout}>
            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.progressContainer}>
                        <Progress
                            type="line"
                            percent={progress}
                            status="active"
                            strokeWidth={10}
                            strokeColor="#1890ff"
                            trailColor="#d9d9d9"
                            style={{ width: '80%' }}
                        />
                        <p className={styles.loadingText}>
                            Conectandonos con los servicios de Inteligencia Artificial de OpenAI... {progress}%
                        </p>
                    </div>
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
