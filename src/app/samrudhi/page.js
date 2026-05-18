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

const Samrudhi = () => {

  const router = useRouter()

  const searchParams = useSearchParams()
  const navbar = searchParams.get('navbar')
  const footer = searchParams.get('footer')

  const form = useForm({
    initialValues: {
      installmentAmt: 1000,
      numInstallment: 11,
      makingCharges: 20,
    },
    validate: {
      installmentAmt: (value) => (value <= 1000 ? null : "Amount must be greater than 0"),
    },
  });

  const getDiscount = () => {

    if (form.values.numInstallment === 11 && form.values.makingCharges <= 20) {
      return (form.values.installmentAmt * form.values.numInstallment * form.values.makingCharges) / 100;
    }
    else
      if (form.values.numInstallment === 11 && form.values.makingCharges >= 20) {
        return (form.values.installmentAmt * form.values.numInstallment * 20) / 100;
      }
    if (form.values.numInstallment < 8) {
      return 0;
    } else
      if (form.values.numInstallment === 8) {
        return (form.values.installmentAmt * form.values.numInstallment * 8) / 100;
      }
      else
        if (form.values.numInstallment === 9) {
          return (form.values.installmentAmt * form.values.numInstallment * 12) / 100;
        }
        else if (form.values.numInstallment === 10) {
          return (form.values.installmentAmt * form.values.numInstallment * 16) / 100;
        }
        else {
          return (form.values.installmentAmt * 1);
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

  const [chartData, setChartData] = useState(getChartData());

  useEffect(() => {
    setChartData(getChartData());
  }, [
    form.values.installmentAmt,
    form.values.makingCharges,
    form.values.numInstallment,
  ]);

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
      },
    },
  };

  return (
    <div className="px-4 py-6 md:px-8 lg:px-14">

      <div className=" bg-white rounded-[10px] shadow-xl border border-[#ececec] p-4">

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* Left Card */}
          <div className="xl:col-span-4">

            <div className="bg-white rounded-[30px] shadow-xl border border-[#ececec] p-4 md:p-6 h-full">

              <h2 className="font-quiche text-xl font-bold text-[#8C5C34] mb-4">
                Scheme Details
              </h2>

              <form className="space-y-6">

                {/* Installment Amount */}
                <div>

                  <div className="flex justify-between items-center mb-4">

                    <label className="font-work text-gray-700 text-sm md:text-base">
                      Installment Amount
                    </label>

                    <span className="font-bold text-[#b7892b] font-quiche text-lg">
                      {formatter1.format(form.values.installmentAmt)}
                    </span>

                  </div>

                  <Slider
                    value={form.values.installmentAmt}
                    onChange={(value) =>
                      form.setFieldValue("installmentAmt", value)
                    }
                    min={5000}
                    max={100000}
                    step={1000}
                    styles={{
                      track: {
                        backgroundColor: "#ececec",
                        height: 6,
                      },
                      thumb: {
                        backgroundColor: "#ffffff",
                        border: "4px solid #b7892b",
                        width: 22,
                        height: 22,
                      },
                      bar: {
                        backgroundColor: "#b7892b",
                      },
                    }}
                  />

                </div>

                {/* Number of Installments */}
                <div>

                  <div className="flex justify-between items-center mb-4">

                    <label className="font-work text-gray-700 text-sm md:text-base">
                      No. of Installments
                    </label>

                    <span className="font-bold text-[#b7892b] font-quiche text-lg">
                      {form.values.numInstallment}
                    </span>

                  </div>

                  <Slider
                    value={form.values.numInstallment}
                    onChange={(value) =>
                      form.setFieldValue("numInstallment", value)
                    }
                    min={1}
                    max={11}
                    step={1}
                    styles={{
                      track: {
                        backgroundColor: "#ececec",
                        height: 6,
                      },
                      thumb: {
                        backgroundColor: "#ffffff",
                        border: "4px solid #b7892b",
                        width: 22,
                        height: 22,
                      },
                      bar: {
                        backgroundColor: "#b7892b",
                      },
                    }}
                  />

                </div>

                {/* Making Charges */}
                <div>

                  <div className="flex justify-between items-center mb-4">

                    <label className="font-work text-gray-700 text-sm md:text-base">
                      Net Making Charges
                    </label>

                    <span className="font-bold text-[#b7892b] font-quiche text-lg">
                      {form.values.makingCharges}%
                    </span>

                  </div>

                  <Slider
                    value={form.values.makingCharges}
                    onChange={(value) =>
                      form.setFieldValue("makingCharges", value)
                    }
                    min={2}
                    max={40}
                    step={1}
                    styles={{
                      track: {
                        backgroundColor: "#ececec",
                        height: 6,
                      },
                      thumb: {
                        backgroundColor: "#ffffff",
                        border: "4px solid #b7892b",
                        width: 22,
                        height: 22,
                      },
                      bar: {
                        backgroundColor: "#b7892b",
                      },
                    }}
                  />

                </div>

              </form>

            </div>

          </div>

          {/* Summary */}
          <div className="xl:col-span-5">

            <div className="bg-white rounded-[30px] shadow-xl border border-[#ececec] p-4 md:p-6 h-full">

              <h2 className="font-quiche text-xl font-bold text-[#8C5C34] mb-4">
                Scheme Summary
              </h2>

              <div className="space-y-3">

                <div className="flex justify-between border-b pb-3">

                  <span className="text-gray-600 font-work">
                    Total Amount Paid
                  </span>

                  <span className="font-bold text-base text-[#222] font-quiche">
                    {formatter.format(getTotal())}
                  </span>

                </div>

                <div className="flex justify-between border-b pb-3">

                  <span className="text-gray-600 font-work">
                    Benefit Offered
                  </span>

                  <span className="font-bold text-base text-[#b7892b] font-quiche">
                    {formatter.format(getDiscount())}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-600 font-work">
                    Redemption Value
                  </span>

                  <span className="font-bold text-lg text-green-600  font-quiche">
                    {formatter.format(getWorth())}
                  </span>

                </div>

              </div>

              {/* Benefit Card */}
              <div className="mt-5 bg-linear-to-r from-[#faf4e8] to-[#fff] border border-[#f1dfb2] rounded-3xl p-4">

                <h3 className="font-quiche text-lg font-bold text-[#b7892b] mb-2">
                  Exclusive Benefit
                </h3>

                <p className="text-gray-700  font-work">
                  No need to pay Making charges{" "}

                  <span className="font-bold text-[#b7892b] font-quiche">
                    {formatter.format(getDiscount())}
                  </span>{" "}

                  on product(s) worth {" "}

                  <span className="font-bold text-[#b7892b] font-quiche">
                    {formatter.format(getTotal())}
                  </span>{" "}

                  (Effectively you get benefit worth {" "}

                  <span className="ml-2 font-quiche font-bold text-green-600">
                    {formatter.format(getDiscount())}
                  </span>{" "}

                  in this example)

                </p>
              </div>

            </div>

          </div>

          {/* Chart */}
          <div className="xl:col-span-3">

            <div className="bg-white rounded-[30px] shadow-xl border border-[#ececec] p-4 md:p-6 h-full flex flex-col">

              <h2 className="font-quiche text-xl font-bold text-[#8C5C34] mb-6 text-center">
                Benefit Breakdown
              </h2>

              <div className="w-full h-[250px] flex items-center justify-center">
                <Pie
                  data={chartData}
                  options={chartOptions}
                  width={250}
                  height={250}
                />
              </div>
              <small className="text-[#8C5C34] text-[10px] text-center font-semibold">The benefits and other details shown above are only indicative.</small>
            </div>

          </div>

        </div>

        {/* Footer */}


        <div className="flex flex-col mt-5">

          <div className="flex items-center justify-center gap-4 md:gap-6 mb-2 ">

            {/* Previous Button */}
            <button
              onClick={() => router.push(`/kubera?navbar=${navbar}&footer=${footer}`)}
              className="w-12 h-12 cursor-pointer md:w-14 md:h-14 rounded-full bg-[#be8c2f] text-white flex items-center justify-center text-xl md:text-2xl shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300"
            >
              ←
            </button>

            {/* Center Text */}
            <div className="flex flex-col items-center">

              <p className="font-work text-[#5c5c5c] text-[15px] md:text-[17px] tracking-wide">
                Sample Calculator For
              </p>

              <p className="font-quiche text-lg md:text-xl leading-none text-[#be8c2f] mt-1">
                Samrudhi
              </p>

            </div>

            {/* Next Button */}
            <button
              onClick={() => router.push(`/ratna?navbar=${navbar}&footer=${footer}`)}
              className="w-12 h-12 md:w-14 cursor-pointer md:h-14 rounded-full bg-[#be8c2f] text-white flex items-center justify-center text-xl md:text-2xl shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300"
            >
              →
            </button>

          </div>

        </div>

      </div>

    </div>

  );
};

export default Samrudhi;