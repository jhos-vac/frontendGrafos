import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Progress } from 'antd';
import styles from '../estilos/components.module.css';
import { createGraph, generateEntity } from "../resources/resource";

const { Option } = Select;

interface FormValues {
    nameStudent: string;
    studentLv: string;
    text: string;
}

interface FormStudentProps {
    selectedData?: any;
    setLoading: (loading: boolean) => void;
    onFinish: () => void;
}

const FormStudent: React.FC<FormStudentProps> = ({ selectedData, setLoading, onFinish }) => {
    const [form] = Form.useForm();
    const [loading, setLocalLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const handleFinish = async (values: FormValues) => {
        setLocalLoading(true);
        setLoading(true);
        setProgress(0); // Reset progress

        // Simulate progress
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prevProgress + 10;
            });
        }, 100);

        try {
            const response = await createGraph(generateEntity, values);
            console.log(response);
            onFinish(); // Llamar a la función de finalización pasada como prop
        } catch (error) {
            console.error('Error creating graph:', error);
        } finally {
            setLocalLoading(false);
            setLoading(false);
        }
    };

    const debounce = (func: (...args: any[]) => void, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    };

    useEffect(() => {
        const handleResize = debounce(() => {
            console.log('Resize event handled');
        }, 100);

        const observer = new ResizeObserver(handleResize);
        const element = document.querySelector('.resize-target');
        if (element) {
            observer.observe(element);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className={styles.FormStudent}>
            {loading ? (
                <div className={styles.loadingContainer}>
                    <Progress type="circle" percent={progress} />
                </div>
            ) : (
                <Form
                    className={styles.Form}
                    form={form}
                    wrapperCol={{ span: 24 }}
                    onFinish={handleFinish}
                >
                    <div className={styles.DateDiv}>
                        <div className={styles.divDateStudent}>
                            <p className={styles.TextForm}>Name Student</p>
                            <Form.Item name="nameStudent">
                                <Input className={styles.InputStudent} placeholder="Add name student" />
                            </Form.Item>
                        </div>

                        <div className={styles.divDateStudent}>
                            <p className={styles.TextForm}>Student Level</p>
                            <Form.Item name="studentLv" className={styles.formItem}>
                                <Select className={styles.InputLevel} placeholder="Select Student Level">
                                    <Option className={styles.InputForm} value="A1">A1</Option>
                                    <Option className={styles.InputForm} value="A2">A2</Option>
                                </Select>
                            </Form.Item>
                        </div>
                    </div>

                    <p style={{ textAlign: "center" }} className={styles.TextForm}>Text</p>
                    <Form.Item name="text">
                        <Input.TextArea
                            className={styles.InputText}
                            placeholder="Add Text"
                            autoSize={{ minRows: 5, maxRows: 10 }}
                        />
                    </Form.Item>
                    <div className={styles.DivCalificationButton}>
                        <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
                            <Button className={styles.Button} type="primary" htmlType="submit">
                                Calification
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            )}
        </div>
    );
};

export default FormStudent;
