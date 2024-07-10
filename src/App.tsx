import React, { useState } from 'react';
import {Col, Layout, Row} from 'antd';
import './App.css';
import FormStudent from "./components/FormStudent";
import HistoryButton from "./components/HistoryButton";
import GraphDisplay from "./components/GraphDisplay";
import styles from './estilos/components.module.css';

const { Header, Content } = Layout;

const App: React.FC = () => {
    const [selectedData, setSelectedData] = useState<any>(null);
    const [graphId, setGraphId] = useState<string | null>(null);

    const handleView = (data: any) => {
        setSelectedData(data);
        setGraphId(data.graphId);
    };

    return (
        <Layout className={styles.Layout}>
            <HistoryButton onView={handleView} />
            <FormStudent selectedData={selectedData} />
            {graphId && <GraphDisplay graphId={graphId} />}
        </Layout>
    );
}

export default App;
