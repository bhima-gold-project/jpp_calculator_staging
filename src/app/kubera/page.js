'use client'

import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import { Slider, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter, useSearchParams } from "next/navigation";

Chart.register(CategoryScale);

const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
});

const formatter1 = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

const Kubera = () => {

    const router = useRouter()

    const searchParams = useSearchParams()

    const navbar = searchParams.get('navbar')
    const footer = searchParams.get('footer')

    const [isVisible, setIsVisible] = useState(false);
    const [goldRate, setGoldRate] = useState(0);

    const form = useForm({
        initialValues: {
            installmentAmt: 10000,
            numInstallment: 11,
            makingCharges: 20,
        },
    });

    const [months, setMonths] = useState([]);

    const fetchGoldRate = async () => {
        try {
            const response = await fetch(
                "https://apis.bhimagold.com/api_db.js/api/v1//todaysgoldrate"
            );

            const data = await response.json();

            const values = Object.values(data);

            if (values.length > 1) {
                const rate = Number(
                    String(values[1]).replace(",", "")
                );

                setGoldRate(rate);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchGoldRate();
    }, []);

    const getNextRate = (rate) => {
        return Math.trunc(rate + rate * 0.005);
    };

    useEffect(() => {

        if (!goldRate) return;

        let currentRate = goldRate;

        const generatedMonths = [];

        for (let i = 1; i <= 11; i++) {

            generatedMonths.push({
                month: i,
                rate: currentRate,
                weight:
                    form.values.installmentAmt / currentRate,
            });

            currentRate = getNextRate(currentRate);
        }

        setMonths(generatedMonths);

    }, [goldRate, form.values.installmentAmt]);

    const totalWeight = months.reduce(
        (acc, item) => acc + item.weight,
        0
    );

    const benefitWeight =
        totalWeight * (form.values.makingCharges / 200);

    const redemptionWeight =
        totalWeight + benefitWeight;

    const chartData = {
        labels: [
            `Benefit Offered (${benefitWeight.toFixed(3)}g)`,
            `Accumulated Weight (${totalWeight.toFixed(3)}g)`,
        ],
        datasets: [
            {
                data: [benefitWeight, totalWeight],
                backgroundColor: ["#f6b800", "#c7931d"],
                borderColor: "#ffffff",
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
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

        <div className="bg-gradient-to-b from-[#fff8e1] to-[#ffffff] px-4 py-6 md:px-8 lg:px-14">

            <div className=" bg-white rounded-[10px] shadow-xl border border-[#ececec] p-4">

                {/* Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* Left */}
                    <div className="xl:col-span-4">

                        <div className="bg-white rounded-[30px] shadow-xl border border-[#ececec] p-4 md:p-6 h-full">

                            <h2 className="font-quiche text-xl font-bold text-[#8C5C34] mb-4">
                                Scheme Details
                            </h2>

                            <div className="space-y-6">

                                {/* Installment */}
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
                                            form.setFieldValue(
                                                "installmentAmt",
                                                value
                                            )
                                        }
                                        min={2000}
                                        max={100000}
                                        step={1000}
                                        styles={{
                                            track: {
                                                backgroundColor: "#e7e1d3",
                                                height: 6,
                                            },
                                            thumb: {
                                                backgroundColor: "#ffffff",
                                                border: "4px solid #be8c2f",
                                                width: 22,
                                                height: 22,
                                            },
                                            bar: {
                                                backgroundColor: "#be8c2f",
                                            },
                                        }}
                                    />

                                </div>

                                {/* Installments */}
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
                                            form.setFieldValue(
                                                "numInstallment",
                                                value
                                            )
                                        }
                                        min={1}
                                        max={11}
                                        step={1}
                                        styles={{
                                            track: {
                                                backgroundColor: "#e7e1d3",
                                                height: 6,
                                            },
                                            thumb: {
                                                backgroundColor: "#ffffff",
                                                border: "4px solid #be8c2f",
                                                width: 22,
                                                height: 22,
                                            },
                                            bar: {
                                                backgroundColor: "#be8c2f",
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
                                                backgroundColor: "#e7e1d3",
                                                height: 6,
                                            },
                                            thumb: {
                                                backgroundColor: "#ffffff",
                                                border: "4px solid #be8c2f",
                                                width: 22,
                                                height: 22,
                                            },
                                            bar: {
                                                backgroundColor: "#be8c2f",
                                            },
                                        }}
                                    />

                                </div>
                            </div>

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
                                        Total Accumulated Weight
                                    </span>

                                    <span className="font-bold text-base text-[#222] font-quiche">
                                        {totalWeight.toFixed(3)}g
                                    </span>

                                </div>

                                <div className="flex justify-between border-b pb-3">

                                    <span className="text-gray-600 font-work">
                                        Benefit Offered
                                    </span>

                                    <span className="font-bold text-base text-[#b7892b] font-quiche">
                                        {benefitWeight.toFixed(3)}g
                                    </span>

                                </div>

                                <div className="flex justify-between items-center">

                                    <span className="text-gray-600 font-work">
                                        Redemption Weight
                                    </span>

                                    <span className="font-bold text-lg text-green-600 font-quiche">
                                        {redemptionWeight.toFixed(3)}g
                                    </span>

                                </div>

                            </div>

                            {/* Benefit */}
                            <div className="mt-5 bg-linear-to-r from-[#faf4e8] to-[#fff] border border-[#f1dfb2] rounded-3xl p-4">

                                <h3 className="font-quiche text-lg font-bold text-[#b7892b] mb-2">
                                    Exclusive Benefit
                                </h3>

                                <p className="text-gray-700 font-work">

                                    You need to pay only {" "}
                                    <span className="font-semibold">
                                        50% of Making Charges
                                    </span>{" "}
                                    on Product (s) weighing {" "}

                                    <span className="font-bold text-[#b7892b] font-quiche">
                                        {totalWeight.toFixed(3)}g
                                    </span> {" "}

                                    (Effectively you get benefit worth{""}
                                    <span className="ml-2 font-quiche font-bold text-green-600">
                                    {benefitWeight.toFixed(3)}g
                                    </span>{" "}
                                      <span className="font-semibold">
                                        of 22Kt Gold
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



                {/* Detailed Table */}
                {isVisible && (

                    <div className="mt-10 bg-[#fffdf8] rounded-[32px] shadow-lg border border-[#e7dcc2] p-6 overflow-auto">

                        <table className="w-full border-collapse">

                            <thead>

                                <tr className="bg-[#f6ecd4]">

                                    <th className="p-4 text-left">Month</th>
                                    <th className="p-4 text-left">Installment</th>
                                    <th className="p-4 text-left">Gold Rate</th>
                                    <th className="p-4 text-left">Gold Weight</th>

                                </tr>

                            </thead>

                            <tbody>

                                {months.map((item) => (

                                    <tr
                                        key={item.month}
                                        className="border-b border-[#ece3cf]"
                                    >

                                        <td className="p-4">
                                            {item.month}
                                        </td>

                                        <td className="p-4">
                                            {formatter.format(
                                                form.values.installmentAmt
                                            )}
                                        </td>

                                        <td className="p-4">
                                            <TextInput
                                                value={formatter.format(item.rate)}
                                                readOnly
                                            />
                                        </td>

                                        <td className="p-4">
                                            {item.weight.toFixed(3)} g
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

                <div className="flex flex-col mt-5">

                    <div className="flex items-center justify-center gap-4 md:gap-6 mb-2 ">

                        {/* Previous Button */}
                        <button
                            onClick={() => router.push(`/shreyas?navbar=${navbar}&footer=${footer}`)}
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
                                Kubera
                            </p>

                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => router.push(`/samrudhi?navbar=${navbar}&footer=${footer}`)}
                            className="w-12 h-12 md:w-14 cursor-pointer md:h-14 rounded-full bg-[#be8c2f] text-white flex items-center justify-center text-xl md:text-2xl shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300"
                        >
                            →
                        </button>

                    </div>

                </div>

            </div>

            <div className="mt-5 text-center">

                <button
                    onClick={() =>
                        setIsVisible(!isVisible)
                    }
                    className="bg-[#be8c2f] text-white px-8 py-3 rounded-full font-work hover:scale-105 transition-all duration-300"
                >
                    {isVisible ? "View Less" : "View More"}
                </button>

            </div>

        </div>
    );
};

export default Kubera;