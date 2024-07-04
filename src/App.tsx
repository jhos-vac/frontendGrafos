import React, { useState } from 'react';
import { Layout } from 'antd';
import './App.css';
import FormStudent from "./components/FormStudent";
import HistoryButton from "./components/HistoryButton";
import GraphDisplay from "./components/GraphDisplay";

const { Header, Content } = Layout;

const App: React.FC = () => {
    const [selectedData, setSelectedData] = useState<any>(null);
    const [graphId, setGraphId] = useState<string | null>(null);

    const handleView = (data: any) => {
        setSelectedData(data);
        setGraphId(data.graphId);
    };

    return (
        <Layout className="layout">
            <HistoryButton onView={handleView} />
            <div style={{width:"80%"}}>
                <FormStudent selectedData={selectedData} />
                {graphId && <GraphDisplay graphId={graphId} />}
            </div>
        </Layout>
    );
}

export default App;
