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

const rateFormatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const Kubera = () => {

    const router = useRouter()

    const searchParams = useSearchParams()

    const navbar = searchParams.get('navbar')
    const footer = searchParams.get('footer')

    const [isVisible, setIsVisible] = useState(false);
    const [goldRate, setGoldRate] = useState(0);
    const [redeemRate, setRedeemRate] = useState(0);

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
        setRedeemRate(currentRate);
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

    const totalInstallmentAmount =
        form.values.installmentAmt *
        form.values.numInstallment;

    const benefitWorth =
        benefitWeight * redeemRate;

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
                            Kubera
                        </h1>

                    </div>

                    <div className="bg-[#fff7e8] border border-[#f1dfb2] rounded-full px-5 py-2">

                        <p className="font-work text-[11px] uppercase tracking-[2px] text-[#8c7b62]">
                            Benefit
                        </p>

                        <h3 className="font-quiche text-[22px] text-[#0c9b4b] leading-none mt-1">
                            50% Making Charges
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
                                    min={2000}
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

                            {/* Months */}
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
                                {benefitWeight.toFixed(3)}g
                            </h3>

                            <p className="mt-2 text-[12px] leading-6 text-[#666] font-work">
                                50% making charge waiver on your jewellery purchase.
                            </p>

                        </div>

                    </div>

                    {/* Summary */}
                    <div className="space-y-3">

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                            <div className="bg-[#fffdf8] border border-[#f1e6cf] rounded-[24px] p-4">

                                <p className="font-work text-[12px] text-[#777] mb-2">
                                    Accumulated
                                </p>

                                <h3 className="font-quiche text-[24px] text-[#1f1f1f] leading-none">
                                    {totalWeight.toFixed(3)}g
                                </h3>

                            </div>

                            <div className="bg-[#fffdf8] border border-[#f1e6cf] rounded-[24px] p-4">

                                <p className="font-work text-[12px] text-[#777] mb-2">
                                    Benefit
                                </p>

                                <h3 className="font-quiche text-[24px] text-[#b7892b] leading-none">
                                    {benefitWeight.toFixed(3)}g
                                </h3>

                            </div>

                            <div className="bg-[#fffdf8] border border-[#f1e6cf] rounded-[24px] p-4">

                                <p className="font-work text-[12px] text-[#777] mb-2">
                                    Redemption
                                </p>

                                <h3 className="font-quiche text-[24px] text-[#0c9b4b] leading-none">
                                    {redemptionWeight.toFixed(3)}g
                                </h3>

                            </div>

                        </div>

                        {/* Benefit Banner */}
                        <div className="bg-gradient-to-r from-[#b7892b] to-[#8C5C34] rounded-[28px] p-5 text-white">

                            <p className="text-[11px] uppercase tracking-[3px] font-work text-white/80">
                                Benefit
                            </p>

                            <p className="font-work leading-7 mt-2">
                                You need to pay only 50% of Making charges on Product (s) weighing
                                {' '}<span className="font-semibold">
                                    {totalWeight.toFixed(3)}g
                                </span>{' '}
                                (Effectively you get benefit worth
                                {' '}<span className="font-semibold">
                                    {benefitWeight.toFixed(3)}g
                                </span>{' '}
                                of 22Kt Gold in this example)
                            </p>

                        </div>

                        {/* View More */}
                        <div className="flex justify-center">

                            <button
                                onClick={() =>
                                    setIsVisible(!isVisible)
                                }
                                className="bg-[#b7892b] text-white px-8 py-3 rounded-full font-work hover:scale-105 transition-all duration-300"
                            >

                                {isVisible
                                    ? "View Less"
                                    : "View More"}

                            </button>

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

                {/* Detailed Table */}
                {isVisible && (

                    <div className="px-3 pb-3">

                        <div className="bg-[#fffdf8] border border-[#eadfc8] rounded-[28px] overflow-hidden">

                            <div className="overflow-auto">

                                <table className="w-full whitespace-nowrap">

                                    <thead className="bg-[#f6ecd4]">

                                        <tr>

                                            <th className="p-4 text-left">
                                                Month
                                            </th>

                                            <th className="p-4 text-left">
                                                Installment
                                            </th>

                                            <th className="p-4 text-left">
                                                Gold Rate
                                            </th>

                                            <th className="p-4 text-left">
                                                Gold Weight
                                            </th>

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
                                                        value={formatter.format(
                                                            item.rate
                                                        )}
                                                        readOnly
                                                    />

                                                </td>

                                                <td className="p-4">
                                                    {item.weight.toFixed(3)} g
                                                </td>

                                            </tr>

                                        ))}

                                        <tr className="bg-[#fdf3d7] font-semibold">

                                            <td className="p-4">
                                                Total
                                            </td>

                                            <td className="p-4">

                                                {formatter.format(
                                                    totalInstallmentAmount
                                                )}

                                            </td>

                                            <td className="p-4">
                                                -
                                            </td>

                                            <td className="p-4 text-[#0c9b4b]">

                                                {totalWeight.toFixed(3)} g

                                            </td>

                                        </tr>

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        {/* Redemption */}
                        <div className="mt-4 bg-[#fdf7ea] border border-[#ecd8a8] rounded-[24px] p-5">

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">

                                <div className="font-work text-[#444]">
                                    Assumed gold rate on redemption day
                                </div>

                                <TextInput
                                    value={
                                        redeemRate
                                            ? rateFormatter.format(
                                                redeemRate
                                            )
                                            : ""
                                    }
                                    onChange={(e) => {

                                        const cleanValue =
                                            e.target.value.replace(
                                                /,/g,
                                                ""
                                            );

                                        const num =
                                            Number(cleanValue);

                                        if (!isNaN(num)) {
                                            setRedeemRate(num);
                                        }

                                    }}
                                />
                                <div className="font-quiche text-[#0c9b4b] text-lg"> <span className="text-[#8C5C34] font-work">Benefit Worth:</span>{" "}{formatter.format(benefitWorth)}</div>


                            </div>

                        </div>

                        {/* Tags */}
                        {/* <div className="mt-4 flex flex-wrap gap-3 text-sm font-work text-[#555]">

                            <span className="px-4 py-2 rounded-full bg-[#fdf3d7] border border-[#ecd8a8]">
                                <b>Gold Rate*</b> : Payment Day Rate
                            </span>

                            <span className="px-4 py-2 rounded-full bg-[#fdf3d7] border border-[#ecd8a8]">
                                <b>Inst.</b> : Installment
                            </span>

                            <span className="px-4 py-2 rounded-full bg-[#fdf3d7] border border-[#ecd8a8]">
                                <b>Wt.</b> : Weight
                            </span>

                        </div> */}

                    </div>

                )}

                {/* Footer Navigation */}
                <div className="border-t border-[#f1e6cf] px-4 py-3 bg-[#fffaf1] flex items-center justify-between">

                    <button
                        onClick={() =>
                            router.push(
                                `/shreyas?navbar=${navbar}&footer=${footer}`
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
                            Kubera
                        </h3>

                    </div>

                    <button
                        onClick={() =>
                            router.push(
                                `/samrudhi?navbar=${navbar}&footer=${footer}`
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

export default Kubera;