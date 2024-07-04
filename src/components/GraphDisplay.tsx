import React, { useEffect, useRef, useState } from 'react';
import { getGraphData } from '../resources/resource'; // Asegúrate de tener esta función para hacer la consulta al backend
import { Spin } from 'antd';
import styles from '../estilos/components.module.css';

interface GraphDisplayProps {
    graphId: string;
}

interface Node {
    identity: string;
    labels: string[];
    properties: {
        id: number;
        graphId: string;
        nombre: string;
    };
    x?: number;
    y?: number;
}

interface Edge {
    identity: string;
    start: string;
    end: string;
    label: string;
    properties: {};
}

interface GraphData {
    n: Node;
    r: Edge | null;
    m: Node | null;
}

const GraphDisplay: React.FC<GraphDisplayProps> = ({ graphId }) => {
    const [graphData, setGraphData] = useState<GraphData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [offset, setOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const data = await getGraphData(graphId);
                setGraphData(data);
            } catch (error) {
                console.error('Error fetching graph data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGraphData();
    }, [graphId]);

    useEffect(() => {
        if (!loading && canvasRef.current) {
            drawGraph(canvasRef.current, graphData);
        }
    }, [loading, graphData]);

    const drawGraph = (canvas: HTMLCanvasElement, data: GraphData[]) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        data.forEach(({ n, m }, index) => {
            if (!n.x || !n.y) {
                n.x = Math.random() * (canvas.width - 100) + 50;
                n.y = Math.random() * (canvas.height - 100) + 50;
            }
            if (m && (!m.x || !m.y)) {
                m.x = Math.random() * (canvas.width - 100) + 50;
                m.y = Math.random() * (canvas.height - 100) + 50;
            }
        });

        // Draw edges
        data.forEach(({ r }) => {
            if (r) {
                const startNode = data.find(d => d.n.identity === r.start)?.n;
                const endNode = data.find(d => d.n.identity === r.end)?.n;
                if (startNode && endNode && startNode.x && startNode.y && endNode.x && endNode.y) {
                    ctx.beginPath();
                    ctx.moveTo(startNode.x, startNode.y);
                    ctx.lineTo(endNode.x, endNode.y);
                    ctx.strokeStyle = '#ccc';
                    ctx.stroke();

                    // Draw arrow
                    const angle = Math.atan2(endNode.y - startNode.y, endNode.x - startNode.x);
                    ctx.beginPath();
                    ctx.moveTo(endNode.x, endNode.y);
                    ctx.lineTo(endNode.x - 10 * Math.cos(angle - Math.PI / 6), endNode.y - 10 * Math.sin(angle - Math.PI / 6));
                    ctx.lineTo(endNode.x - 10 * Math.cos(angle + Math.PI / 6), endNode.y - 10 * Math.sin(angle + Math.PI / 6));
                    ctx.lineTo(endNode.x, endNode.y);
                    ctx.fillStyle = '#ccc';
                    ctx.fill();
                }
            }
        });

        // Draw nodes
        data.forEach(({ n }) => {
            if (n.x && n.y) {
                ctx.beginPath();
                ctx.arc(n.x, n.y, 20, 0, 2 * Math.PI);
                ctx.fillStyle = '#666';
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText(n.properties.nombre, n.x, n.y + 5);
            }
        });
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const node = graphData.find(({ n }) => {
            if (!n.x || !n.y) return false;
            const dx = n.x - x;
            const dy = n.y - y;
            return Math.sqrt(dx * dx + dy * dy) < 20;
        });

        if (node) {
            setSelectedNode(node.n);
            setOffset({ x: node.n.x! - x, y: node.n.y! - y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!selectedNode) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        selectedNode.x = x + offset.x;
        selectedNode.y = y + offset.y;

        drawGraph(canvas, graphData);
    };

    const handleMouseUp = () => {
        setSelectedNode(null);
    };

    if (loading) {
        return <Spin className={styles.LoadingSpinner} />;
    }

    return (
        <canvas
            ref={canvasRef}
            width="800"
            height="600"
            className={styles.GraphCanvas}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        ></canvas>
    );
};

export default GraphDisplay;
