'use client'

import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Slider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter, useSearchParams } from "next/navigation";

Chart.register(CategoryScale);

const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const formatter1 = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const GoldenKey = () => {

  const router = useRouter()
  const searchParams = useSearchParams()

  const navbar = searchParams.get('navbar')
  const footer = searchParams.get('footer')

  const form = useForm({
    initialValues: {
      installmentAmt: 5000,
      numInstallment: 11,
      makingCharges: 20,
    },
  });

  const getDiscount = () => {
    if (form.values.numInstallment < 11) {
      return 0;
    } else {
      return (
        form.values.installmentAmt *
        form.values.numInstallment *
        form.values.makingCharges
      ) / 100;
    }
  };

  const getTotal = () =>
    form.values.installmentAmt * form.values.numInstallment;

  const getWorth = () =>
    getDiscount() +
    form.values.installmentAmt * form.values.numInstallment;

  const getChartData = () => {
    const discount = getDiscount();
    const amount = getTotal();

    const Data = [
      {
        label: `Benefit Offered (${formatter.format(discount)})`,
        amount: getDiscount(),
      },
      {
        label: `Amount Paid (${formatter.format(amount)})`,
        amount: getTotal(),
      },
    ];

    return {
      labels: Data.map((data) => data.label),
      datasets: [
        {
          backgroundColor: ["#f6b800", "#c7931d"],
          data: Data.map((data) => data.amount),
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: false,

    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1800,
    },

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const [chartData, setChartData] = useState(getChartData());

  useEffect(() => {
    setChartData(getChartData());
  }, [
    form.values.installmentAmt,
    form.values.makingCharges,
    form.values.numInstallment,
  ]);

  return (
    <div className="w-full h-full  p-2 md:p-3">

      <div className="max-w-[1280px] mx-auto bg-white rounded-[30px] border border-[#eadfc8] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-4 md:px-6 py-4 border-b border-[#f2e6cf] bg-gradient-to-r from-[#fffaf1] to-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <p className="font-work text-[11px] uppercase tracking-[3px] text-[#9c8661]">
              Jewellery Purchase Plan
            </p>

            <h1 className="font-quiche text-[34px] md:text-[44px] text-[#b7892b] leading-none">
              Golden Key
            </h1>

          </div>

          <div className="bg-[#fff7e8] border border-[#f1dfb2] rounded-full px-5 py-2">

            <p className="font-work text-[11px] uppercase tracking-[2px] text-[#8c7b62]">
              Benefit
            </p>

            <h3 className="font-quiche text-[22px] text-[#0c9b4b] leading-none mt-1">
              No Making Charges
            </h3>

          </div>

        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_280px] gap-3 p-3">

          {/* Calculator Panel */}
          <div className="bg-[#fffdf8] border border-[#f1e6cf] rounded-[26px] p-4">

            <div className="space-y-6">

              {/* Installment */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="font-work text-[13px] text-[#666]">
                    Installment
                  </label>

                  <span className="font-quiche text-[18px] text-[#b7892b]">
                    {formatter1.format(
                      form.values.installmentAmt
                    )}
                  </span>

                </div>

                <Slider
                  value={form.values.installmentAmt}
                  onChange={(value) =>
                    form.setFieldValue(
                      "installmentAmt",
                      value
                    )
                  }
                  min={5000}
                  max={100000}
                  step={1000}
                  styles={{
                    track: {
                      backgroundColor: "#ececec",
                      height: 5,
                    },
                    thumb: {
                      backgroundColor: "#ffffff",
                      border: "3px solid #b7892b",
                      width: 18,
                      height: 18,
                    },
                    bar: {
                      backgroundColor: "#b7892b",
                    },
                  }}
                />

              </div>

              {/* Installments */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="font-work text-[13px] text-[#666]">
                    Months
                  </label>

                  <span className="font-quiche text-[18px] text-[#b7892b]">
                    {form.values.numInstallment}
                  </span>

                </div>

                <Slider
                  value={form.values.numInstallment}
                  onChange={(value) =>
                    form.setFieldValue(
                      "numInstallment",
                      value
                    )
                  }
                  min={1}
                  max={11}
                  step={1}
                  disabled
                  styles={{
                    track: {
                      backgroundColor: "#ececec",
                      height: 5,
                    },
                    thumb: {
                      backgroundColor: "#ffffff",
                      border: "3px solid #b7892b",
                      width: 18,
                      height: 18,
                    },
                    bar: {
                      backgroundColor: "#b7892b",
                    },
                  }}
                />

              </div>

              {/* Making Charges */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="font-work text-[13px] text-[#666]">
                    Making Charges
                  </label>

                  <span className="font-quiche text-[18px] text-[#b7892b]">
                    {form.values.makingCharges}%
                  </span>

                </div>

                <Slider
                  value={form.values.makingCharges}
                  onChange={(value) =>
                    form.setFieldValue(
                      "makingCharges",
                      value
                    )
                  }
                  min={2}
                  max={40}
                  step={1}
                  styles={{
                    track: {
                      backgroundColor: "#ececec",
                      height: 5,
                    },
                    thumb: {
                      backgroundColor: "#ffffff",
                      border: "3px solid #b7892b",
                      width: 18,
                      height: 18,
                    },
                    bar: {
                      backgroundColor: "#b7892b",
                    },
                  }}
                />

              </div>

            </div>

            {/* Benefit Box */}
            <div className="mt-5 rounded-[22px] bg-gradient-to-r from-[#fbf4e5] to-[#fff] border border-[#f2dfb5] p-4">

              <p className="font-work text-[11px] uppercase tracking-[2px] text-[#8c7b62]">
                Benefit
              </p>

              <h3 className="font-quiche text-[30px] text-[#0c9b4b] leading-none mt-2">
                {formatter.format(
                  getDiscount()
                )}
              </h3>

              <p className="mt-2 text-[12px] leading-6 text-[#666] font-work">
                Enjoy No Jewellery Making Charges on the Total Amount Paid.
              </p>

            </div>

          </div>

          {/* Summary */}
          <div className="space-y-3">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              <div className="bg-[#fffdf8] border border-[#f1e6cf] rounded-[24px] p-4">

                <p className="font-work text-[12px] text-[#777] mb-2">
                  Total Paid
                </p>

                <h3 className="font-quiche text-[24px] text-[#1f1f1f] leading-none">
                  {formatter.format(
                    getTotal()
                  )}
                </h3>

              </div>

              <div className="bg-[#fffdf8] border border-[#f1e6cf] rounded-[24px] p-4">

                <p className="font-work text-[12px] text-[#777] mb-2">
                  Benefit
                </p>

                <h3 className="font-quiche text-[24px] text-[#b7892b] leading-none">
                  {formatter.format(
                    getDiscount()
                  )}
                </h3>

              </div>

              <div className="bg-[#fffdf8] border border-[#f1e6cf] rounded-[24px] p-4">

                <p className="font-work text-[12px] text-[#777] mb-2">
                  Redemption
                </p>

                <h3 className="font-quiche text-[24px] text-[#0c9b4b] leading-none">
                  {formatter.format(
                    getWorth()
                  )}
                </h3>

              </div>

            </div>

            {/* Benefit Banner */}
            <div className="bg-gradient-to-r from-[#b7892b] to-[#8C5C34] rounded-[28px] p-5 text-white">

              <p className="text-[11px] uppercase tracking-[3px] font-work text-white/80">
                Benefit
              </p>

              <p className="font-work leading-7 mt-2">
                No Making charges on Total Amount Paid i.e,
                {" "}<span className="font-semibold">
                  {formatter.format(
                    getTotal()
                  )}
                </span>{" "}
                (Effectively you get benefit worth
                {" "}<span className="font-semibold">
                  {formatter.format(
                    getDiscount()
                  )}
                </span>{" "}
                in this example)
              </p>
            </div>

          </div>

          {/* Pie Chart */}
          <div className="bg-[#fffdf8] border border-[#f1e6cf] rounded-[26px] p-4 flex flex-col items-center justify-center">
            <p className="font-work text-[12px] text-[#777] mb-2">
              Benefit Breakdown
            </p>
            <div className="w-[190px] h-[190px]">

              <Pie
                data={chartData}
                options={{
                  ...chartOptions,
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />

            </div>

            <p className="mt-3 text-[10px] text-center text-[#8C5C34] font-work leading-4">
              Benefits shown are indicative only.
            </p>

          </div>

        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-[#f1e6cf] px-4 py-3 bg-[#fffaf1] flex items-center justify-between">

          <button
            onClick={() =>
              router.push(
                `/ratna?navbar=${navbar}&footer=${footer}`
              )
            }
            className="w-10 h-10 rounded-full bg-[#b7892b] text-white flex items-center justify-center hover:scale-105 transition"
          >
            ←
          </button>

          <div className="text-center">

            <p className="font-work text-[11px] uppercase tracking-[3px] text-[#8c7b62]">
              Sample Calculator
            </p>

            <h3 className="font-quiche text-[24px] text-[#b7892b] leading-none">
              Golden Key
            </h3>

          </div>

          <button
            onClick={() =>
              router.push(
                `/shreyas?navbar=${navbar}&footer=${footer}`
              )
            }
            className="w-10 h-10 rounded-full bg-[#b7892b] text-white flex items-center justify-center hover:scale-105 transition"
          >
            →
          </button>

        </div>

      </div>

    </div>
  )

};

export default GoldenKey;