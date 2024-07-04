import React from 'react';
import { Card } from 'antd';
import styles from '../estilos/components.module.css';

interface StudentDetailsProps {
    student: {
        nameStudent: string;
        studentLevel: string;
        context: string;
    };
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ student }) => {
    return (
        <Card className={styles.StudentCard}>
            <div className={styles.StudentDetails}>
                <p><strong>Name:</strong> {student.nameStudent}</p>
                <p><strong>Level:</strong> {student.studentLevel}</p>
                <p><strong>Context:</strong> {student.context}</p>
            </div>
        </Card>
    );
};

export default StudentDetails;
