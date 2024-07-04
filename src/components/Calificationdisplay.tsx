import React from 'react';
import { Card } from 'antd';
import styles from '../estilos/components.module.css';

interface CalificationDisplayProps {
    calification: string;
}

const processText = (text: string) => {
    const sections = text.split('\n\n');
    return sections.map((section, index) => {
        if (section.startsWith('### ')) {
            return <h3 key={index}>{section.substring(4)}</h3>;
        } else if (section.startsWith('**')) {
            const boldText = section.substring(2, section.length - 2);
            return <p key={index}><strong>{boldText}</strong></p>;
        } else if (section.startsWith('1.')) {
            const lines = section.split('\n').map((line, lineIndex) => {
                if (line.startsWith('   -')) {
                    return <li key={lineIndex}>{line.substring(5)}</li>;
                }
                return <p key={lineIndex}>{line}</p>;
            });
            return <div key={index}>{lines}</div>;
        } else {
            return <p key={index}>{section}</p>;
        }
    });
};

const CalificationDisplay: React.FC<CalificationDisplayProps> = ({ calification }) => {
    const processedText = processText(calification);
    return (
        <Card className={styles.CalificationCard}>
            <div className={styles.CalificationText}>
                {processedText}
            </div>
        </Card>
    );
};

export default CalificationDisplay;
