'use client';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, createContext, useState } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext'
import type { ChartDataState, ChartOptionsState } from '@/types';
import axios, { AxiosRequestConfig } from 'axios';
import { MyContext, MyProvider } from '../../layout/context/myUserContext'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'


const Charts = () => {


  const useMyContext = () => useContext(MyContext);
  const {
    fetchWithToken, Backend_BASE_URL,
    Frontend_BASE_URL } = useMyContext();

  const router = useRouter()


  const [options, setOptions] = useState<ChartOptionsState>({});
  const [data, setChartData] = useState<ChartDataState>({});

  const { layoutConfig } = useContext(LayoutContext);
  const [contracts, setContracts] = useState([]);
  const [groupedSum, setGroupedSum] = useState([]);

  const [expMonth, setExpMonth] = useState([]);
  const [mybarData, setbarData] = useState([]);


  const [label, setLabel] = useState([]);
  const [data2, setData2] = useState([]);

  const [receipts, setReceipts] = useState([]);
  const [payments, setPayments] = useState([]);




  const [myPieData, setMyPieData] = useState('');
  const [myLinearData, setMyLinearData] = useState([]);
  const [myDoughnutData, setMyDoughnutData] = useState('');

  function getMonthsBetween(startMonth: number, endMonth: number): string[] {
    const months: string[] = [];
    const monthNames: string[] = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    // Iterate through the months
    if (endMonth > startMonth) {
      for (let i = startMonth; i < endMonth; i++) {
        months.push(monthNames[i - 1]); // Subtract 1 because month numbers are 1-based
      }
      return months;
    }
    else {

      if ((startMonth + 6) > 12) {
        for (let i = startMonth; i <= 12; i++) {
          months.push(monthNames[i - 1]); // Subtract 1 because month numbers are 1-based
        }
        for (let i = 1; i < ((startMonth + 6) - 12); i++) {
          months.push(monthNames[i - 1]); // Subtract 1 because month numbers are 1-based
          // console.log(monthNames[i - 1]);
        }
        // console.log(months)
      }

      return months;
    }

  }

  const fetchContracts = async () => {

    const session = sessionStorage.getItem('token');
    const jwtToken = JSON.parse(session);

    if (jwtToken && jwtToken.access_token) {
      const jwtTokenf = jwtToken.access_token;

      const roles = jwtToken.roles;
      const entity = jwtToken.entity;
      const config: AxiosRequestConfig = {
        method: 'get',
        url: `${Backend_BASE_URL}/contracts`,
        headers: {
          'user-role': `${roles}`,
          'entity': `${entity}`,
          'Authorization': `Bearer ${jwtTokenf}`,
          'Content-Type': 'application/json'
        }
      };
      axios(config)
        .then(function (response) {
          setContracts(response.data);
          const contracts = response.data;

          if (response.data.length > 0) {

            interface CtrType {
              type: string;
              amount: number;
            }

            interface CtrStatus {
              status: string;
              amount: number;
            }

            interface CtrExp {
              date: Date;
              amount: number;
            }

            const documentStyle = getComputedStyle(document.documentElement);

            const ctrExpArray: CtrExp[] = [];
            const ctrExpResult: CtrExp[] = [];
            contracts.forEach(ctr => {
              if (ctr && ctr.end) {
                const toAdd = { date: ctr.end, amount: 1 }
                ctrExpArray.push(toAdd)

                // console.log(ctrExpArray)
                // year: ctr.end.getFullYear(), month: ctr.end.getMonth() + 1,
                const today = new Date();

                const currentMonth = today.getMonth() + 1; // Extract the month (0-11), adding 1 to get the correct month number (1-12)
                const currentYear = today.getFullYear(); // Extract the year (e.g., 2024)

                const desiredMonth = currentMonth + 6; // Add 6 months to the current month
                let newMonth = desiredMonth % 12 - 2; // Ensure the new month is within the range 0-11
                let newYear = currentYear + Math.floor(desiredMonth / 12); // Adjust the year if necessary

                // If newMonth is 0, it means we have overflowed into the next year
                if (newMonth === 0) {
                  newMonth = 12; // Set newMonth to December
                  newYear--; // Adjust the year
                }
                const newDate = new Date(newYear, newMonth, today.getDate());
                const startMonth = currentMonth; // feb
                const startYear = currentYear; // feb
                const endMonth = desiredMonth; // August
                const endYear = newYear; // feb

                const expCtr: [] = [];
                for (let i = 0; i <= ctrExpArray.length; i++) {
                  if (ctrExpArray[i]) {
                    if (
                      new Date(ctrExpArray[i].date) >= new Date(today) &&
                      new Date(ctrExpArray[i].date) <= new Date(newDate)) {
                      // console.log("exp", new Date(ctrExpArray[i].date), "peste 6 luni", new Date(newDate), "azi", new Date(today))
                      //se verifica luna cu luna si se introduce in array poz 1 - 6
                      let add: CtrExp = { date: ctrExpArray[i].date, amount: 1 }
                      expCtr.push(add)
                    }
                  }
                }

                const RezexpCtr: [] = [];

                for (let j = 0; j <= 5; j++) {
                  for (let i = 0; i <= expCtr.length; i++) {
                    if (expCtr[i]) {
                      const currentDate = new Date();

                      let startMonth = currentDate.getMonth() + j;
                      let startnewYear = currentDate.getFullYear();
                      if (startMonth === 13) {
                        startMonth = 1; // Set newMonth to January
                        startnewYear++; // Increment the year
                      }
                      // Get the first day of the month
                      const newstartDate = new Date(startnewYear, startMonth, 1);

                      // Get the last day of the next month, then subtract one day to get the last day of the current month
                      const newDate = new Date(startnewYear, startMonth + 1, 0);

                      //    console.log(expCtr[i], new Date(newstartDate).toLocaleDateString(), new Date(newDate).toLocaleDateString())
                      if (
                        new Date(expCtr[i].date) >= new Date(newstartDate) &&
                        new Date(expCtr[i].date) <= new Date(newDate)) {
                        let add = { month: j, amount: 1 }
                        RezexpCtr.push(add)
                      }
                      else {
                        let add = { month: j, amount: 0 }
                        RezexpCtr.push(add)
                      }
                    }
                  }
                }

                const RezexpCtrCount: [] = [];
                const grouped: Map<string, number> = new Map();
                RezexpCtr.forEach(contract => {
                  const { month, amount } = contract;
                  if (grouped.has(month)) {
                    grouped.set(month, grouped.get(month)! + amount);
                  } else {
                    grouped.set(month, amount);
                  }
                });
                grouped.forEach((value, key) => {
                  const toAdd = { month: key, amount: value }
                  RezexpCtrCount.push(toAdd)
                });

                // console.log(RezexpCtrCount)

                const final: [] = [];

                for (let i = 0; i <= RezexpCtrCount.length; i++) {
                  if (RezexpCtrCount[i]) {
                    final.push(RezexpCtrCount[i].amount)
                  }
                }


                const monthsBetween = getMonthsBetween(startMonth, endMonth);
                setExpMonth(monthsBetween);

                // console.log(final, monthsBetween)


                const barData: ChartData = {
                  labels: monthsBetween,
                  datasets: [
                    {
                      label: 'Nr. Contracte ce urmeaza sa expire',
                      backgroundColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                      borderColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
                      data: final
                    }
                  ]
                }

                setbarData(barData);

              }
            })


            const ctrStatusArray: CtrStatus[] = [];
            const ctrStatusResult: CtrStatus[] = [];
            contracts.forEach(ctr => {
              const toAdd = { status: ctr.status.name, amount: 1 }
              ctrStatusArray.push(toAdd)
            })
            // console.log(ctrStatusArray)
            //

            // const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
            // const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
            // const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';


            const groupedSum1: Map<string, number> = new Map();
            ctrStatusArray.forEach(contract => {
              const { status, amount } = contract;
              if (groupedSum1.has(status)) {
                groupedSum1.set(status, groupedSum1.get(status)! + amount);
              } else {
                groupedSum1.set(status, amount);
              }
            });
            groupedSum1.forEach((value, key) => {
              const toAdd = { type: key, amount: value }
              ctrStatusResult.push(toAdd)
              // console.log(`${key}: ${value}`);
            });


            const dataStatus: [] = []
            ctrStatusResult.map(
              contract => {
                dataStatus.push(contract.amount)
              }
            );

            const labelsStatus: [] = []
            for (let i = 0; i < ctrStatusResult.length; i++) {
              labelsStatus.push(ctrStatusResult[i].type);

            }



            const MyDoughnutData: ChartData = {
              labels: labelsStatus,
              datasets: [
                {
                  data: dataStatus,
                  backgroundColor: [
                    documentStyle.getPropertyValue('--purple-500'),
                    documentStyle.getPropertyValue('--yellow-500'),
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--indigo-500'),
                    documentStyle.getPropertyValue('--blue-500')
                  ],
                  hoverBackgroundColor: [
                    // documentStyle.getPropertyValue('--indigo-400') || '#8183f4', documentStyle.getPropertyValue('--purple-400') || '#b975f9', documentStyle.getPropertyValue('--teal-400') || '#41c5b7'
                    documentStyle.getPropertyValue('--purple-500'),
                    documentStyle.getPropertyValue('--yellow-500'),
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--indigo-500'),
                    documentStyle.getPropertyValue('--blue-500')
                  ]

                }
              ]
            };

            setMyDoughnutData(MyDoughnutData);

            //


            const label: [] = [];
            const data: [] = [];

            const ctrTypeArray: CtrType[] = [];
            const ctrTypeArrayResult: CtrType[] = [];

            contracts.forEach(ctr => {
              const toAdd = { type: ctr.type.name, amount: 1 }
              ctrTypeArray.push(toAdd)
            })

            const groupedSum: Map<string, number> = new Map();
            ctrTypeArray.forEach(contract => {
              const { type, amount } = contract;
              if (groupedSum.has(type)) {
                groupedSum.set(type, groupedSum.get(type)! + amount);
              } else {
                groupedSum.set(type, amount);
              }
            });
            groupedSum.forEach((value, key) => {
              const toAdd = { type: key, amount: value }
              ctrTypeArrayResult.push(toAdd)
              // console.log(`${key}: ${value}`);
            });


            const data22: [] = []
            ctrTypeArrayResult.map(
              contract => {
                data22.push(contract.amount)
              }
            );

            const labels: [] = []
            for (let i = 0; i < ctrTypeArrayResult.length; i++) {
              labels.push(ctrTypeArrayResult[i].type);

            }
            setLabel(labels)



            const pieData: ChartData = {
              labels: labels,
              datasets: [
                {
                  data: data22,
                  backgroundColor: [
                    documentStyle.getPropertyValue('--indigo-500') || '#6366f1', documentStyle.getPropertyValue('--purple-500') || '#a855f7', documentStyle.getPropertyValue('--teal-500') || '#14b8a6'
                    // documentStyle.getPropertyValue('--purple-500'),
                    // documentStyle.getPropertyValue('--yellow-500'),
                    // documentStyle.getPropertyValue('--green-500'),
                    // documentStyle.getPropertyValue('--indigo-500'),
                    // documentStyle.getPropertyValue('--blue-500')
                  ],
                  hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--indigo-400') || '#8183f4', documentStyle.getPropertyValue('--purple-400') || '#b975f9', documentStyle.getPropertyValue('--teal-400') || '#41c5b7'
                    // documentStyle.getPropertyValue('--purple-500'),
                    // documentStyle.getPropertyValue('--yellow-500'),
                    // documentStyle.getPropertyValue('--green-500'),
                    // documentStyle.getPropertyValue('--indigo-500'),
                    // documentStyle.getPropertyValue('--blue-500')
                  ]
                }
              ]
            };
            setMyPieData(pieData)
          }
          // fetchCashFlow()

        })
        .catch(function (error) {
          setContracts([]);
          // router.push('http://localhost:5500/auth/login')
          console.log(error);
        });
    }
  }

  const fetchCashFlow = async () => {

    await fetch("http://localhost:3000/contracts/cashflow")
      .then(response => {
        return response.json()
      })
      .then(results => {


        setReceipts(results[0])
        setPayments(results[1])
        const start_month = results[2]
        const end_month = 1 + results[3]



        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';

        const months = getMonthsBetween(start_month, end_month)

        const lineData: ChartData = {
          labels: months,
          datasets: [
            {
              label: 'Incasari',
              data: results[1]
              ,
              fill: false,
              backgroundColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
              // borderColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
              borderColor: documentStyle.getPropertyValue('--green-500'),
              tension: 0.6
            },
            {
              label: 'Plati',
              data: results[0]
              ,
              fill: false,
              backgroundColor: documentStyle.getPropertyValue('--primary-200') || '#bcbdf9',
              // borderColor: documentStyle.getPropertyValue('--primary-200') || '#bcbdf9',
              borderColor: documentStyle.getPropertyValue('--red-500'),
              tension: 0.6
            }
          ]
        };
        setMyLinearData(lineData)
      }
      )
  }

  const pieData: ChartData = {
    labels: [label],
    datasets: [
      {
        data: [data2]
      }
    ]
  };


  useEffect(() => {
    fetchCashFlow()
  }, [])

  useEffect(() => {

    fetchContracts()


    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';

    // const pieData: ChartData = {
    //   labels: ['A', 'B'],
    //   datasets: [
    //     {
    //       data: [5, 7],
    //       backgroundColor: [
    //         // documentStyle.getPropertyValue('--indigo-500') || '#6366f1', documentStyle.getPropertyValue('--purple-500') || '#a855f7', documentStyle.getPropertyValue('--teal-500') || '#14b8a6'
    //         documentStyle.getPropertyValue('--blue-500'),
    //         documentStyle.getPropertyValue('--yellow-500'),
    //         documentStyle.getPropertyValue('--green-500')
    //       ],
    //       hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400') || '#8183f4', documentStyle.getPropertyValue('--purple-400') || '#b975f9', documentStyle.getPropertyValue('--teal-400') || '#41c5b7']

    //     }
    //   ]
    // };


    // const barData: ChartData = {
    //   labels:
    //     ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [
    //     {
    //       label: 'Nr. Contracte ce urmeaza sa expire',
    //       backgroundColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
    //       borderColor: documentStyle.getPropertyValue('--primary-500') || '#6366f1',
    //       data: [65, 59, 80, 81, 56, 55]
    //     }
    //   ]
    // };

    const barOptions: ChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: '500'
            }
          },
          grid: {
            display: false
          },
          border: {
            display: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          },
          border: {
            display: false
          }
        }
      }
    };


    const pieOptions: ChartOptions = {
      plugins: {
        legend: {
          display: true, // Show the legend on the chart
          position: 'bottom',
          // position: { x: 100, y: 100 }, // Set custom legend position
          labels: {
            font: {
              size: 12, // Font size
              family: 'Arial', // Font family
              // style: 'italic', // Font style
            },
            usePointStyle: true,
            color: textColor
          }
        }
      },

    };

    // const monthsBetween = getMonthsBetween(startMonth, endMonth);
    // setExpMonth(monthsBetween);



    const lineOptions: ChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          },
          border: {
            display: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          },
          border: {
            display: false
          }
        }
      }
    };

    const polarData: ChartData = {
      datasets: [
        {
          data: [11, 16, 7, 3],
          backgroundColor: [
            documentStyle.getPropertyValue('--indigo-500') || '#6366f1',
            documentStyle.getPropertyValue('--purple-500') || '#a855f7',
            documentStyle.getPropertyValue('--teal-500') || '#14b8a6',
            documentStyle.getPropertyValue('--orange-500') || '#f97316'
          ],
          label: 'My dataset'
        }
      ],
      labels: ['Indigo', 'Purple', 'Teal', 'Orange']
    };

    const polarOptions: ChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    const radarData: ChartData = {
      labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
      datasets: [
        {
          label: 'My First dataset',
          borderColor: documentStyle.getPropertyValue('--indigo-400') || '#8183f4',
          pointBackgroundColor: documentStyle.getPropertyValue('--indigo-400') || '#8183f4',
          pointBorderColor: documentStyle.getPropertyValue('--indigo-400') || '#8183f4',
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor: documentStyle.getPropertyValue('--indigo-400') || '#8183f4',
          data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          borderColor: documentStyle.getPropertyValue('--purple-400') || '#b975f9',
          pointBackgroundColor: documentStyle.getPropertyValue('--purple-400') || '#b975f9',
          pointBorderColor: documentStyle.getPropertyValue('--purple-400') || '#b975f9',
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor: documentStyle.getPropertyValue('--purple-400') || '#b975f9',
          data: [28, 48, 40, 19, 96, 27, 100]
        }
      ]
    };

    const radarOptions: ChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        r: {
          grid: {
            color: textColorSecondary
          }
        }
      }
    };

    setOptions({
      barOptions,
      pieOptions,
      lineOptions,
      polarOptions,
      radarOptions
    });
    setChartData({
      // barData,
      // pieData,
      // lineData,
      polarData,
      radarData
    });
  }, [layoutConfig]);



  return (
    <div className="grid p-fluid">


      <div className="col-12 xl:col-6">
        <div className="card" >
          <h5>Cash flow</h5>
          <Chart
            style={{ height: '30vh' }}
            type="line" data={myLinearData} options={options.lineOptions}></Chart>
        </div>
      </div>


      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Expira</h5>
          <Chart style={{ height: '30vh' }} type="bar" data={mybarData} options={options.barOptions}></Chart>
        </div>
      </div>


      <div className="col-12 xl:col-6">
        <div className="card flex flex-column align-items-center">
          <h5 className="text-left w-full">Tipuri Contracte</h5>
          <Chart
            style={{ width: '50vh', height: '50vh' }}
            type="doughnut" data={myPieData} options={options.pieOptions}></Chart>
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card flex flex-column align-items-center">
          <h5 className="text-left w-full">Stari Contracte</h5>
          <Chart
            style={{ width: '50vh', height: '50vh' }}
            type="doughnut" data={myDoughnutData} options={options.pieOptions}></Chart>
        </div>
      </div>

    </div>
  );
};

export default Charts;
