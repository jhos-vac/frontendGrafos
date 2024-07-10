import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import { getGraphData } from '../resources/resource';
import styles from '../estilos/components.module.css'

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
    const containerRef = useRef<HTMLDivElement>(null);
    const [graphData, setGraphData] = useState<GraphData[]>([]);

    useEffect(() => {
        const fetchGraphData = async () => {
            const data = await getGraphData(graphId) as GraphData[];

            const nodeMap = new Map<string, { id: string; label: string }>();
            const edgeMap = new Map<string, { id: string; from: string; to: string; label: string }>();

            data.forEach(({ n, m, r }) => {
                if (!nodeMap.has(n.identity)) {
                    nodeMap.set(n.identity, {
                        id: n.identity,
                        label: n.properties.nombre || n.properties.descripcion || n.labels[0],
                    });
                }
                if (m && !nodeMap.has(m.identity)) {
                    nodeMap.set(m.identity, {
                        id: m.identity,
                        label: m.properties.nombre || m.properties.descripcion || m.labels[0],
                    });
                }
                if (r && !edgeMap.has(r.identity)) {
                    edgeMap.set(r.identity, {
                        id: r.identity,
                        from: r.start,
                        to: r.end,
                        label: r.label,
                    });
                }
            });

            const nodes = new DataSet(Array.from(nodeMap.values()));
            const edges = new DataSet(Array.from(edgeMap.values()));

            if (containerRef.current) {
                const network = new Network(containerRef.current, { nodes, edges }, {
                    layout: {
                        improvedLayout: true,
                        hierarchical: false,
                    },
                    physics: {
                        enabled: true,
                        barnesHut: {
                            gravitationalConstant: -8000,
                            centralGravity: 0.3,
                            springLength: 95,
                            springConstant: 0.04,
                            damping: 0.09,
                        },
                        solver: 'barnesHut',
                    },
                });
            }
        };

        fetchGraphData();
    }, [graphId]);

    return (
        <div ref={containerRef} className={styles.divGraph} />
    );
};

export default GraphDisplay;
