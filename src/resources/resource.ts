import axios from "axios";


export const generateEntity  = "http://localhost:8000/ia/generateEntity"
export const getGraphs = "http://localhost:8000/node/getGraph"
export const getHistory = "http://localhost:8000/historial/getHistorial"



export const ViewData = async (url: string) =>{
    const response = await axios.get(url);
    return response.data;
};


export const createGraph = async (url: string, data: any) => {
    const response = await axios.post(url, data);
    return response.data;
};

export const deleteGraph = async (url: string) => {
    const response = await axios.delete(url);
    return response.data;
}
export const getGraphData = async (graphId: string) => {
    const response = await fetch(`http://localhost:8000/ia/${graphId}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
};
