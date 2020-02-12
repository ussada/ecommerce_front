import React, { PropTypes } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Avatar,
    List,
    ListItem,
    Grid
} from '@material-ui/core'

const CustomPieChart = props => {
    const styles = {
        custom_tooltip: {
            backgroundColor: "#ffffff",
            border: "1px solid #ccbbbb",
            padding: "10px"
        },
        cardDetail: {
            paddingLeft: 16,
            paddingBottom: 16,
            marginTop: -12,
            fontSize: 18
        },
        cartSubTitle: {
            paddingLeft: 18,
            paddingBottom: 16,
            marginTop: -12,
            fontSize: 12
        }
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active) {
            let item = payload[0];
            const _toolTipText = item.name + ` (${item.payload.value})`;
            return (
            <div style={styles.custom_tooltip}>
                <p className="label">{_toolTipText}</p>
            </div>
            );
        }

        return null;
    };

    const {className, title, graphdetail, subheader, data, ...otherProps} = props;

    return (
        <Card className={className}>
            <CardHeader title={title} />
            {graphdetail && <div style={styles.cardDetail}>{graphdetail}</div>}
            {subheader && <div style={styles.cartSubTitle}>{subheader}</div>}
            <Divider />

            <CardContent>
                <Grid container spacing={0} alignItems="center" justify="center" >
                    <Grid item lg={6} md={4} xl={4} xs={6}>
                        {/* <ResponsiveContainer> */}
                        <PieChart width={180} height={180} >
                            <Pie
                                innerRadius={40}
                                outerRadius={80}
                                data={data}
                                fill="#8884d8"
                            >
                            {
                                data && data.map(item => (
                                    <Cell key={item.name} fill={item.color} />
                                ))
                            }
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                        {/* </ResponsiveContainer> */}
                </Grid>
                <Grid item lg={6} md={4} xl={4} xs={6}>
                    <List>
                        {data && data.map(item => (
                            <>
                            <ListItem>
                                <Avatar
                                    style={{
                                        margin: 10,
                                        color: item.color,
                                        backgroundColor: item.color
                                    }}
                                />
                                {item.name}
                            </ListItem>
                            </>
                        ))}
                    </List>
                </Grid>
            </Grid>
            </CardContent>
        </Card>
    );
};

export default CustomPieChart;
