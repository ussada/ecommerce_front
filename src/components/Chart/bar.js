import React, { Component } from 'react';
import propTypes from 'prop-types';
import palette from '../../theme/palette';
import { Bar } from 'react-chartjs-2';
import {withStyles} from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
} from '@material-ui/core';
import { Link } from "react-router-dom";
const styles = theme => ({
    root: {},
    chartContainer: {
      // height: 400,
      position: 'relative'
    },
    actions: {
      justifyContent: 'flex-end'
    }
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  legend: { display: false },
  cornerRadius: 20,
  // title: {
  //   display: true,
  //   text: 'Pay amount by bank(YTD)',
  //   fontColor: '#ff7043',
  //   fontSize: 25
  // },
  tooltips: {
    enabled: true,
    mode: 'index',
    intersect: false,
    borderWidth: 1,
    borderColor: palette.divider,
    backgroundColor: palette.white,
    titleFontColor: palette.text.primary,
    bodyFontColor: palette.text.secondary,
    footerFontColor: palette.text.secondary
  },
  layout: { padding: 0 },
  scales: {
    xAxes: [
      {
        barThickness: 10,
        maxBarThickness: 40,
        barPercentage: 0,
        categoryPercentage: 0,
        ticks: {
          fontColor: palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: palette.divider
        }
      }
    ]
  }
};

const sum_options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  legend: { display: false },
  cornerRadius: 20,
  tooltips: {
    enabled: true,
    mode: 'index',
    intersect: false,
    borderWidth: 1,
    borderColor: palette.divider,
    backgroundColor: palette.white,
    titleFontColor: palette.text.primary,
    bodyFontColor: palette.text.secondary,
    footerFontColor: palette.text.secondary
  },
  layout: { padding: 0 },
  scales: {
    xAxes: [
      {
        barThickness: 10,
        maxBarThickness: 40,
        barPercentage: 0,
        categoryPercentage: 0,
        ticks: {
          fontColor: palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: palette.divider
        }
      }
    ]
  }
};

const options_custom_toolTip = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  legend: { display: false },
  cornerRadius: 20,  
  tooltips: {    
    callbacks: {
      title: function(tooltipItem, data) {
        return data['labels'][tooltipItem[0]['index']];
      },
      label: function(tooltipItem, data) {   
        if(data['datasets'] && data['datasets'][tooltipItem['datasetIndex']])     
          return data['datasets'][tooltipItem['datasetIndex']]['text'] + ': ' + data['datasets'][tooltipItem['datasetIndex']]['data'][tooltipItem['index']];
        else  
          return '';
      }      
    },
  },
  layout: { padding: 0 },
  scales: {
    xAxes: [
      {
        barThickness: 10,
        maxBarThickness: 40,
        barPercentage: 0,
        categoryPercentage: 0,
        ticks: {
          fontColor: palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: palette.divider
        }
      }
    ]
  }
};

class BarChart extends Component {

  render() {
    let { customToolTip, history_url, classes, title, subheader, graphdetail, title_action, action, data, labels, variant, color, className, onElementClick, ...rest } = this.props;
    history_url = history_url ? history_url : '/#';
    
    // Load color from palette
    if(palette[color] !== undefined && palette[color].main !== undefined) {
      color = palette[color].main;
    }

    // Set variant's data
    if(variant === "month") {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      color = color || palette.primary.main;
    }
    else if(variant === "quarter") {
      labels = ['Q1', 'Q2', 'Q3', 'Q4', 'YTD'];
      color = color || palette.secondary.main;
    }
    else {
      labels = labels || data.labels;
      color = color || palette.primary.main;
    }

    // Set data
    let datasets = {};

    if (data.constructor === Array) {
        datasets = [
          {
            backgroundColor: color,
            data: data
          }
        ]
    }
    else {
      if (data.datasets)
        datasets = data.datasets.map((item, idx) => ({key: idx, ...item}))
      else
        datasets = [
          {
            backgroundColor: color,
            data: data.data
          }
        ]
    }

    data = {
      labels,
      datasets,
      variant
    };

    const styles = {
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
    }

    return (

      <div className={className}>
      <Card
        {...rest}
        className={classes.root}
      >
        {(title || title_action) && <CardHeader action={title_action} title={title} />}
        {graphdetail && <div style={styles.cardDetail}>{graphdetail}</div>}
        {subheader && <div style={styles.cartSubTitle}>{subheader}</div>}
        {(title || title_action) && <Divider />}

        <CardContent>
          <div className={classes.chartContainer}>
            <Bar
              data={data}
              options={ rest.graph !== 'sum' ? (customToolTip ? options_custom_toolTip : options) : sum_options}
              onElementsClick={onElementClick}
            />
          </div>
        </CardContent>

        {action && <Divider />}
        {action && <CardActions className={classes.actions}>{action}</CardActions>}
      </Card>
      </div>
    );
  }
}

BarChart.propTypes = {
  customToolTip: propTypes.any,
  history_url: propTypes.string,
  classes: propTypes.any,
  title: propTypes.string,
  subheader: propTypes.string,
  graphdetail: propTypes.string,
  title_action: propTypes.string,
  action: propTypes.any,
}

export default withStyles(styles)(BarChart);
