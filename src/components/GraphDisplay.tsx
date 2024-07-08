import React, { useEffect, useRef, useState } from 'react';
import { getGraphData } from '../resources/resource';
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
        nombre?: string;
        descripcion?: string;
    };
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
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

        const nodeMap: { [key: string]: Node } = {};
        const relationCounts: { [key: string]: number } = {};

        data.forEach(({ n, m, r }) => {
            if (!nodeMap[n.identity]) {
                nodeMap[n.identity] = n;
                relationCounts[n.identity] = 0;
            }
            if (m && !nodeMap[m.identity]) {
                nodeMap[m.identity] = m;
                relationCounts[m.identity] = 0;
            }
            if (r) {
                relationCounts[r.start] = (relationCounts[r.start] || 0) + 1;
                relationCounts[r.end] = (relationCounts[r.end] || 0) + 1;
            }
        });

        // Identify the central node
        let centralNode: any | Node | null = null;
        let maxRelations = 0;
        Object.keys(relationCounts).forEach(identity => {
            if (relationCounts[identity] > maxRelations) {
                maxRelations = relationCounts[identity];
                centralNode = nodeMap[identity];
            }
        });

        if (centralNode) {
            // Position the central node
            centralNode.x = canvas.width / 2;
            centralNode.y = canvas.height / 2;

            // Position other nodes around the central node
            const nodes = Object.values(nodeMap).filter(node => node !== centralNode);
            const angleStep = (2 * Math.PI) / nodes.length;
            nodes.forEach((node, index) => {
                const angle = index * angleStep;
                node.x = centralNode!.x! + 200 * Math.cos(angle);
                node.y = centralNode!.y! + 200 * Math.sin(angle);
            });
        }

        // Draw edges
        data.forEach(({ r }) => {
            if (r) {
                const startNode = nodeMap[r.start];
                const endNode = nodeMap[r.end];
                if (startNode && endNode && startNode.x !== undefined && startNode.y !== undefined && endNode.x !== undefined && endNode.y !== undefined) {
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

                    // Draw edge label
                    ctx.save();
                    ctx.translate((startNode.x + endNode.x) / 2, (startNode.y + endNode.y) / 2);
                    ctx.rotate(angle);
                    ctx.fillStyle = '#fff';
                    ctx.fillText(r.label, 0, -5);
                    ctx.restore();
                }
            }
        });

        // Draw nodes
        Object.values(nodeMap).forEach((node) => {
            if (node.x !== undefined && node.y !== undefined) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
                ctx.fillStyle = '#666';
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                const label = node.properties.nombre || node.properties.descripcion || node.labels[0];
                ctx.fillText(label, node.x, node.y + 5);
            }
        });
    };



    return (
        <canvas
            ref={canvasRef}
            width="800"
            height="600"
            className={styles.GraphCanvas}
        ></canvas>
    );
};

export default GraphDisplay;
