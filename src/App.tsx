import React, { useState } from 'react';
import {Layout} from 'antd';
import './App.css';
import FormStudent from "./components/FormStudent";
import HistoryButton from "./components/HistoryButton";
import GraphDisplay from "./components/GraphDisplay";
import styles from './estilos/components.module.css';
import StudentDetails from "./components/StudentDetails";
import CalificationDisplay from "./components/Calificationdisplay";

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
            <HistoryButton onView={handleView}/>
            <FormStudent selectedData={selectedData}/>
            {selectedData && (
                <StudentDetails student={{
                   nameStudent: selectedData.nameStudent,
                   studentLevel: selectedData.studentLevel,
                   context: selectedData.context,
                }}/>
            )}
            <div className={styles.divDetails} >
                <div className={styles.DivCalification}>
                    {selectedData && selectedData.calification && (
                        <CalificationDisplay calification={selectedData.calification}/>
                    )}
                </div>

                    {graphId && <GraphDisplay graphId={graphId}/>}
            </div>

        </Layout>
    );
}

export default App;
