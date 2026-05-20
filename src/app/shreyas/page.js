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

const Shreyas = () => {

    const router = useRouter()
    const searchParams = useSearchParams()

    const navbar = searchParams.get('navbar')
    const footer = searchParams.get('footer')

    const [isVisible, setIsVisible] = useState(false);
    const [metal, setMetal] = useState("gold");

    const [rates, setRates] = useState({
        gold: 0,
        silver: 0,
    });

    const [redeemRate, setRedeemRate] = useState(0);

    const form = useForm({
        initialValues: {
            installmentAmt: 10000,
            numInstallment: 11,
            va: 18,
        },
    });

    const [rateState, setRateState] = useState([]);

    useEffect(() => {

        fetch("https://apis.bhimagold.com/api_db.js/api/v1//todaysgoldrate")
            .then((res) => res.json())
            .then((data) => {

                setRates({
                    gold: Number(data.gold22k.replace(/,/g, "")),
                    silver: Number(data.silver.replace(/,/g, "")),
                });

            });

    }, []);

    const getNextRate = (rate) => {
        return Math.trunc(rate + rate * 0.005);
    };

    useEffect(() => {

        const baseRate =
            metal === "gold"
                ? rates.gold
                : rates.silver;

        if (!baseRate || metal === "diamond") return;

        let currentRate = baseRate;

        const generatedRates = [];

        for (let i = 0; i < 11; i++) {

            generatedRates.push({
                rate: currentRate,
                weight:
                    form.values.installmentAmt /
                    currentRate,
            });

            currentRate = getNextRate(currentRate);
        }

        setRedeemRate(currentRate);
        setRateState(generatedRates);

    }, [
        rates,
        metal,
        form.values.installmentAmt,
    ]);

    const totalWeight = rateState.reduce(
        (acc, item) => acc + item.weight,
        0
    );

    const benefitPercent = () => {
        return form.values.va <= 18
            ? form.values.va
            : 18;
    };

    const benefitWeight = () => {

        if (metal === "diamond") {
            return 0;
        }

        return (
            totalWeight *
            (benefitPercent() / 100)
        );
    };

    const redemptionWeight = () => {
        return totalWeight + benefitWeight();
    };

    const totalAmountPayable =
        form.values.installmentAmt *
        form.values.numInstallment;

    const diamondBenefit =
        form.values.installmentAmt * 2;

    const benefitInRs =
        totalWeight *
        (benefitPercent() / 100) *
        redeemRate;

    const chartData = {

        labels:
            metal === "diamond"
                ? [
                    `Benefit Offered (${formatter.format(
                        diamondBenefit
                    )})`,
                    `Amount Paid (${formatter.format(
                        totalAmountPayable
                    )})`,
                ]
                : [
                    `Benefit Offered (${benefitWeight().toFixed(3)}g)`,
                    `Accumulated Weight (${totalWeight.toFixed(3)}g)`,
                ],

        datasets: [
            {
                data:
                    metal === "diamond"
                        ? [
                            diamondBenefit,
                            totalAmountPayable,
                        ]
                        : [
                            benefitWeight(),
                            totalWeight,
                        ],

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

    const changeRate = (index, value) => {

        const cleanValue = value.replace(/,/g, "");
        const num = Number(cleanValue);

        const updated = [...rateState];

        if (!isNaN(num) && num > 0) {

            updated[index] = {
                rate: num,
                weight:
                    form.values.installmentAmt / num,
            };

        } else {

            updated[index] = {
                rate: 0,
                weight: 0,
            };

        }

        setRateState(updated);
    };

    return (
        <div className="w-full h-full bg-[#f8f5ee] p-2 md:p-3">

            <div className="max-w-[1280px] mx-auto bg-white rounded-[30px] border border-[#eadfc8] shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-4 md:px-6 py-4 border-b border-[#f2e6cf] bg-gradient-to-r from-[#fffaf1] to-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                        <p className="font-work text-[11px] uppercase tracking-[3px] text-[#9c8661]">
                            Jewellery Purchase Plan
                        </p>

                        <h1 className="font-quiche text-[34px] md:text-[44px] text-[#b7892b] leading-none">
                            Shreyas
                        </h1>

                    </div>

                    <div className="flex flex-wrap gap-2">

                        {["gold", "silver", "diamond"].map((item) => (

                            <button
                                key={item}
                                onClick={() => setMetal(item)}
                                className={`
                        px-5 py-2 rounded-full text-sm font-work capitalize transition-all duration-300 border

                        ${metal === item
                                        ? "bg-[#b7892b] text-white border-[#b7892b] shadow-md"
                                        : "bg-[#fffdf8] text-[#555] border-[#eadfc8] hover:bg-[#f6ecd4]"
                                    }
                    `}
                            >

                                {item === "diamond"
                                    ? "Diamond & Platinum"
                                    : item === "gold" ? 'Gold' : item == "silver" ? 'Silver' : null}

                            </button>

                        ))}

                    </div>

                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_280px] gap-3 p-3">

                    {/* Left Calculator */}
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
                                    min={1000}
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
                            {metal !== "diamond" && (

                                <div>

                                    <div className="flex items-center justify-between mb-2">

                                        <label className="font-work text-[13px] text-[#666]">
                                            Making Charges
                                        </label>

                                        <span className="font-quiche text-[18px] text-[#b7892b]">
                                            {form.values.va}%
                                        </span>

                                    </div>

                                    <Slider
                                        value={form.values.va}
                                        onChange={(value) =>
                                            form.setFieldValue(
                                                "va",
                                                value
                                            )
                                        }
                                        min={1}
                                        max={40}
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

                            )}

                        </div>

                        {/* Savings Card */}
                        <div className="mt-5 rounded-[22px] bg-gradient-to-r from-[#fbf4e5] to-[#fff] border border-[#f2dfb5] p-4">

                            <p className="font-work text-[11px] uppercase tracking-[2px] text-[#8c7b62]">
                                Estimated Benefit
                            </p>

                            <h3 className="font-quiche text-[30px] text-[#0c9b4b] leading-none mt-2">

                                {metal === "diamond"
                                    ? formatter.format(
                                        diamondBenefit
                                    )
                                    : `${benefitWeight().toFixed(3)}g`}

                            </h3>

                            <p className="mt-2 text-[12px] leading-6 text-[#666] font-work">

                                Exclusive savings on your jewellery purchase plan.

                            </p>

                        </div>

                    </div>

                    {/* Summary */}
                    <div className="space-y-3">

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                            <div className="bg-[#fffdf8] border border-[#f1e6cf] rounded-[24px] p-4">

                                <p className="font-work text-[12px] text-[#777] mb-2">

                                    {metal === "diamond"
                                        ? "Total Paid"
                                        : "Accumulated"}

                                </p>

                                <h3 className="font-quiche text-[24px] text-[#1f1f1f] leading-none">

                                    {metal === "diamond"
                                        ? formatter.format(
                                            totalAmountPayable
                                        )
                                        : `${totalWeight.toFixed(3)}g`}

                                </h3>

                            </div>

                            <div className="bg-[#fffdf8] border border-[#f1e6cf] rounded-[24px] p-4">

                                <p className="font-work text-[12px] text-[#777] mb-2">
                                    Benefit
                                </p>

                                <h3 className="font-quiche text-[24px] text-[#b7892b] leading-none">

                                    {metal === "diamond"
                                        ? formatter.format(
                                            diamondBenefit
                                        )
                                        : `${benefitWeight().toFixed(3)}g`}

                                </h3>

                            </div>

                            <div className="bg-[#fffdf8] border border-[#f1e6cf] rounded-[24px] p-4">

                                <p className="font-work text-[12px] text-[#777] mb-2">

                                    {metal === "diamond"
                                        ? "Maturity"
                                        : "Redemption"}

                                </p>

                                <h3 className="font-quiche text-[24px] text-[#0c9b4b] leading-none">

                                    {metal === "diamond"
                                        ? formatter.format(
                                            totalAmountPayable +
                                            diamondBenefit
                                        )
                                        : `${redemptionWeight().toFixed(3)}g`}

                                </h3>

                            </div>

                        </div>

                        {/* Benefit Banner */}
                        <div className="bg-gradient-to-r from-[#b7892b] to-[#8C5C34] rounded-[28px] p-5 text-white">

                            <p className="text-[11px] uppercase tracking-[3px] font-work text-white/80">
                                Exclusive Benefit
                            </p>

                            <h3 className="font-quiche text-[30px] leading-none mt-2">

                                {metal === "diamond"
                                    ? "2 Installments Free"
                                    : "No Making Charges"}

                            </h3>

                            <p className="mt-3 text-sm leading-7 text-white/90 font-work">

                                {metal === "diamond" ? (
                                    <>
                                        You get benefit worth{" "}
                                        <span className="font-semibold">
                                            {formatter.format(
                                                diamondBenefit
                                            )}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Save up to{" "}
                                        <span className="font-semibold">
                                            {benefitPercent()}%
                                        </span>{" "}
                                        making charges on your jewellery purchase.
                                    </>
                                )}

                            </p>

                        </div>

                        {/* View More */}
                        {metal !== "diamond" && (

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

                        )}

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
                {metal !== "diamond" && isVisible && (

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
                                                Metal Rate
                                            </th>

                                            <th className="p-4 text-left">
                                                Weight Credit
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {rateState.map((item, index) => (

                                            <tr
                                                key={index}
                                                className="border-b border-[#ece3cf]"
                                            >

                                                <td className="p-4">
                                                    {index + 1}
                                                </td>

                                                <td className="p-4">

                                                    {formatter.format(
                                                        form.values.installmentAmt
                                                    )}

                                                </td>

                                                <td className="p-4">

                                                    <TextInput
                                                        value={rateFormatter.format(
                                                            item.rate
                                                        )}
                                                        onChange={(e) =>
                                                            changeRate(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
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
                                                    totalAmountPayable
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

                                    Assumed {metal} rate on redemption day

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

                                <div className="font-quiche text-[#0c9b4b] text-lg"> <span className="text-[#8C5C34] font-work">Benefit Worth:</span>{" "}{formatter.format(benefitInRs)}</div>

                            </div>

                            </div>

                            {/* Tags */}
                            {/* <div className="mt-4 flex flex-wrap gap-3 text-sm font-work text-[#555]">

                                <span className="px-4 py-2 rounded-full bg-[#fdf3d7] border border-[#ecd8a8]">
                                    <b>Metal Rate*</b> : Payment Day Rate
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
                                        `/goldenkey?navbar=${navbar}&footer=${footer}`
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
                                    Shreyas
                                </h3>

                            </div>

                            <button
                                onClick={() =>
                                    router.push(
                                        `/kubera?navbar=${navbar}&footer=${footer}`
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

    // return (

    //     <div className=" bg-gradient-to-b from-[#fff8e1] to-[#ffffff] px-4 py-6 md:px-8 lg:px-14">


    //         <div className=" bg-white rounded-[10px] shadow-xl border border-[#ececec] p-4">

    //             {/* Main Grid */}
    //             <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

    //                 {/* Left */}
    //                 <div className="xl:col-span-4">

    //                     <div className="bg-white rounded-[30px] shadow-xl border border-[#ececec] p-4 md:p-6 h-full">

    //                         <h2 className="font-quiche text-xl font-bold text-[#8C5C34] mb-4">
    //                             Scheme Details
    //                         </h2>

    //                         {/* Metal Selection */}
    //                         <div className="mb-4">

    //                             <label className="font-quiche  text-[#4b4b4b] text-[16px] block mb-2">
    //                                 Jewellery Type
    //                             </label>

    //                             <div className="flex flex-wrap gap-6">

    //                                 {["gold", "silver", "diamond"].map((item) => (

    //                                     <label
    //                                         key={item}
    //                                         className="flex items-center gap-3 cursor-pointer"
    //                                     >

    //                                         <input
    //                                             type="radio"
    //                                             checked={metal === item}
    //                                             onChange={() => setMetal(item)}
    //                                             className="accent-[#be8c2f] w-4 h-4"
    //                                         />

    //                                         <span className="font-work capitalize text-[#333]">
    //                                             {item === "diamond"
    //                                                 ? "Diamond & Platinum"
    //                                                 : item}
    //                                         </span>

    //                                     </label>

    //                                 ))}

    //                             </div>

    //                         </div>

    //                         <div className="space-y-6">

    //                             {/* Installment */}
    //                             <div>

    //                                 <div className="flex justify-between items-center mb-4">

    //                                     <label className="font-work text-gray-700 text-sm md:text-base">
    //                                         Installment Amount
    //                                     </label>


    //                                     <span className="font-bold text-[#b7892b] font-quiche text-lg">
    //                                         {formatter1.format(
    //                                             form.values.installmentAmt
    //                                         )}
    //                                     </span>

    //                                 </div>

    //                                 <Slider
    //                                     value={form.values.installmentAmt}
    //                                     onChange={(value) =>
    //                                         form.setFieldValue(
    //                                             "installmentAmt",
    //                                             value
    //                                         )
    //                                     }
    //                                     min={1000}
    //                                     max={100000}
    //                                     step={1000}
    //                                     styles={{
    //                                         track: {
    //                                             backgroundColor: "#e7e1d3",
    //                                             height: 6,
    //                                         },
    //                                         thumb: {
    //                                             backgroundColor: "#ffffff",
    //                                             border: "4px solid #be8c2f",
    //                                             width: 22,
    //                                             height: 22,
    //                                         },
    //                                         bar: {
    //                                             backgroundColor: "#be8c2f",
    //                                         },
    //                                     }}
    //                                 />

    //                             </div>

    //                             {/* Installments */}
    //                             <div>

    //                                 <div className="flex justify-between items-center mb-4">

    //                                     <label className="font-work text-gray-700 text-sm md:text-base">
    //                                         No. of Installments
    //                                     </label>

    //                                     <span className="font-bold text-[#b7892b] font-quiche text-lg">
    //                                         {form.values.numInstallment}
    //                                     </span>

    //                                 </div>

    //                                 <Slider
    //                                     value={form.values.numInstallment}
    //                                     onChange={(value) =>
    //                                         form.setFieldValue(
    //                                             "numInstallment",
    //                                             value
    //                                         )
    //                                     }
    //                                     min={1}
    //                                     max={11}
    //                                     step={1}
    //                                     styles={{
    //                                         track: {
    //                                             backgroundColor: "#e7e1d3",
    //                                             height: 6,
    //                                         },
    //                                         thumb: {
    //                                             backgroundColor: "#ffffff",
    //                                             border: "4px solid #be8c2f",
    //                                             width: 22,
    //                                             height: 22,
    //                                         },
    //                                         bar: {
    //                                             backgroundColor: "#be8c2f",
    //                                         },
    //                                     }}
    //                                 />

    //                             </div>

    //                             {/* VA */}
    //                             {metal !== "diamond" && (

    //                                 <div>

    //                                     <div className="flex justify-between items-center mb-4">

    //                                         <label className="font-work text-gray-700 text-sm md:text-base">
    //                                             Net Making Charges
    //                                         </label>

    //                                         <span className="font-bold text-[#b7892b] font-quiche text-lg">
    //                                             {form.values.va}%
    //                                         </span>

    //                                     </div>

    //                                     <Slider
    //                                         value={form.values.va}
    //                                         onChange={(value) =>
    //                                             form.setFieldValue(
    //                                                 "va",
    //                                                 value
    //                                             )
    //                                         }
    //                                         min={1}
    //                                         max={40}
    //                                         styles={{
    //                                             track: {
    //                                                 backgroundColor: "#e7e1d3",
    //                                                 height: 6,
    //                                             },
    //                                             thumb: {
    //                                                 backgroundColor: "#ffffff",
    //                                                 border: "4px solid #be8c2f",
    //                                                 width: 22,
    //                                                 height: 22,
    //                                             },
    //                                             bar: {
    //                                                 backgroundColor: "#be8c2f",
    //                                             },
    //                                         }}
    //                                     />

    //                                 </div>

    //                             )}

    //                         </div>


    //                     </div>

    //                 </div>

    //                 {/* Summary */}
    //                 <div className="xl:col-span-5">

    //                     <div className="bg-white rounded-[30px] shadow-xl border border-[#ececec] p-4 md:p-6 h-full">

    //                         <h2 className="font-quiche text-xl font-bold text-[#8C5C34] mb-4">
    //                             Scheme Summary
    //                         </h2>

    //                         <div className="space-y-3">
    //                             <div className="flex justify-between border-b pb-3">

    //                                 <span className="text-gray-600 font-work">

    //                                     {metal === "diamond"
    //                                         ? "Total Amount Paid"
    //                                         : "Total Accumulated Weight"}

    //                                 </span>

    //                                 <span className="font-bold text-base text-[#222] font-quiche">

    //                                     {metal === "diamond"
    //                                         ? formatter.format(
    //                                             totalAmountPayable
    //                                         )
    //                                         : `${totalWeight.toFixed(3)}g`}

    //                                 </span>

    //                             </div>
    //                             <div className="flex justify-between border-b pb-3">

    //                                 <span className="text-gray-600 font-work">
    //                                     Benefit Offered
    //                                 </span>

    //                                 <span className="font-bold text-base text-[#b7892b] font-quiche">

    //                                     {metal === "diamond"
    //                                         ? formatter.format(
    //                                             diamondBenefit
    //                                         )
    //                                         : `${benefitWeight().toFixed(3)}g`}

    //                                 </span>

    //                             </div>

    //                             <div className="flex justify-between items-center">

    //                                 <span className="text-gray-600 font-work">

    //                                     {metal === "diamond"
    //                                         ? "Redemption Value"
    //                                         : "Redemption Weight"}

    //                                 </span>

    //                                 <span className="font-bold text-lg text-green-600 font-quiche">

    //                                     {metal === "diamond"
    //                                         ? formatter.format(
    //                                             totalAmountPayable +
    //                                             diamondBenefit
    //                                         )
    //                                         : `${redemptionWeight().toFixed(3)}g`}

    //                                 </span>

    //                             </div>

    //                         </div>

    //                         {/* Benefit */}
    //                         <div className="mt-5 bg-linear-to-r from-[#faf4e8] to-[#fff] border border-[#f1dfb2] rounded-3xl p-4">


    //                             <h3 className="font-quiche text-lg font-bold text-[#b7892b] mb-2">
    //                                 Exclusive Benefit
    //                             </h3>

    //                             <p className="text-[#3f3f3f] font-work">

    //                                 {metal === "diamond" ? (

    //                                     <>
    //                                         You get benefit worth {' '}
    //                                         <span className="font-bold text-[#b7892b] font-quiche">
    //                                             {formatter.format(
    //                                                 diamondBenefit
    //                                             )}
    //                                         </span> {' '}
    //                                         (Equivalent to 2 Installments in this example)
    //                                     </>

    //                                 ) : (

    //                                     <>
    //                                         No need to pay Making charges up to {' '}
    //                                         <span className="font-bold text-black font-quiche">
    //                                             {benefitPercent()}%
    //                                         </span> {' '}
    //                                         on Product (s) weighing {' '}

    //                                         <span className="font-bold text-[#b7892b] font-quiche">
    //                                             {totalWeight.toFixed(3)}g
    //                                         </span> {' '}

    //                                         (Effectively you get benefit worth {' '}
    //                                         <span className="font-bold text-green-600 font-quiche">
    //                                             {benefitWeight().toFixed(3)}g
    //                                         </span>
    //                                         {' '}
    //                                         of {metal === "silver" ? 'Silver' :
    //                                             <span className="font-semibold">
    //                                                 22Kt Gold
    //                                             </span>}{' '}in this example)
    //                                     </>

    //                                 )}

    //                             </p>

    //                         </div>

    //                     </div>

    //                 </div>

    //                 {/* Chart */}
    //                 <div className="xl:col-span-3">

    //                     <div className="bg-[#fffdf8] rounded-4xl shadow-lg border border-[#e7dcc2] p-4 md:p-6 h-full flex flex-col">

    //                         <h2 className="font-quiche text-xl font-bold text-[#8C5C34] mb-6 text-center">
    //                             Benefit Breakdown
    //                         </h2>

    //                         <div className="w-full h-[250px] flex items-center justify-center">
    //                             <Pie
    //                                 data={chartData}
    //                                 options={chartOptions}
    //                                 width={250}
    //                                 height={250}
    //                             />
    //                         </div>

    //                         <small className="text-[#8C5C34] text-[10px] text-center font-semibold">The benefits and other details shown above are only indicative.</small>

    //                     </div>

    //                 </div>

    //             </div>


    //             {/* Detailed Table */}
    //             {metal !== "diamond" && isVisible && (
    //                 <>

    //                     <div className="mt-10 bg-[#fffdf8] rounded-4xl shadow-lg border border-[#e7dcc2] p-6 overflow-auto">
    //                         <table className="w-full border-collapse flex-shrink-0 whitespace-nowrap">

    //                             <thead>

    //                                 <tr className="bg-[#f6ecd4]">

    //                                     <th className="p-4 text-left">
    //                                         Month
    //                                     </th>

    //                                     <th className="p-4 text-left">
    //                                         Installment
    //                                     </th>

    //                                     <th className="p-4 text-left">
    //                                         Metal Rate
    //                                     </th>

    //                                     <th className="p-4 text-left">
    //                                         Weight Credit
    //                                     </th>

    //                                 </tr>

    //                             </thead>

    //                             <tbody>

    //                                 {rateState.map((item, index) => (

    //                                     <tr
    //                                         key={index}
    //                                         className="border-b border-[#ece3cf]"
    //                                     >

    //                                         <td className="p-4">
    //                                             {index + 1}
    //                                         </td>

    //                                         <td className="p-4">

    //                                             {formatter.format(
    //                                                 form.values.installmentAmt
    //                                             )}

    //                                         </td>

    //                                         <td className="p-4">

    //                                             <TextInput
    //                                                 value={rateFormatter.format(
    //                                                     item.rate
    //                                                 )}
    //                                                 onChange={(e) =>
    //                                                     changeRate(
    //                                                         index,
    //                                                         e.target.value
    //                                                     )
    //                                                 }
    //                                             />

    //                                         </td>

    //                                         <td className="p-4">
    //                                             {item.weight.toFixed(3)} g
    //                                         </td>

    //                                     </tr>

    //                                 ))}
    //                                 <tr className="bg-[#fdf3d7] font-semibold">

    //                                     <td className="p-4">
    //                                         Total
    //                                     </td>

    //                                     <td className="p-4">

    //                                         {formatter.format(
    //                                             totalAmountPayable
    //                                         )}

    //                                     </td>

    //                                     <td className="p-4">
    //                                         -
    //                                     </td>

    //                                     <td className="p-4 text-[#0c9b4b]">

    //                                         {totalWeight.toFixed(3)} g

    //                                     </td>

    //                                 </tr>

    //                             </tbody>

    //                         </table>
    //                     </div>

    //                     {/* Redemption */}
    //                     <div className="mt-8 bg-[#fdf7ea] border border-[#ecd8a8] rounded-3xl p-6">

    //                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">

    //                             <div className="font-work text-[#444]">

    //                                 Assumed {metal} rate on the day of redemption

    //                             </div>

    //                             <div>

    //                                 <TextInput
    //                                     value={
    //                                         redeemRate
    //                                             ? rateFormatter.format(
    //                                                 redeemRate
    //                                             )
    //                                             : ""
    //                                     }
    //                                     onChange={(e) => {

    //                                         const cleanValue =
    //                                             e.target.value.replace(
    //                                                 /,/g,
    //                                                 ""
    //                                             );

    //                                         const num =
    //                                             Number(cleanValue);

    //                                         if (!isNaN(num)) {
    //                                             setRedeemRate(num);
    //                                         }

    //                                     }}
    //                                 />

    //                             </div>

    //                             <div className="font-semibold text-[#be8c2f] text-lg">

    //                                 Benefit Worth:
    //                                 {" "}
    //                                 {formatter.format(
    //                                     benefitInRs
    //                                 )}

    //                             </div>

    //                         </div>

    //                     </div>
    //                     <div className="mt-3 flex flex-wrap gap-3 text-sm font-work text-[#555]">

    //                         <span className="px-4 py-2 rounded-full bg-[#fdf3d7] border border-[#ecd8a8]">
    //                             <b>Metal Rate*</b> : Metal Rate on the day of payment
    //                         </span>

    //                         <span className="px-4 py-2 rounded-full bg-[#fdf3d7] border border-[#ecd8a8]">
    //                             <b>Inst.</b> : Installment
    //                         </span>

    //                         <span className="px-4 py-2 rounded-full bg-[#fdf3d7] border border-[#ecd8a8]">
    //                             <b>Wt.</b> : Weight
    //                         </span>

    //                     </div>
    //                 </>
    //             )}
    //             <div className="flex flex-col mt-5">

    //                 <div className="flex items-center justify-center gap-4 md:gap-6 mb-2 ">

    //                     {/* Previous Button */}
    //                     <button
    //                         onClick={() => router.push(`/goldenkey?navbar=${navbar}&footer=${footer}`)}
    //                         className="w-12 h-12 cursor-pointer md:w-14 md:h-14 rounded-full bg-[#be8c2f] text-white flex items-center justify-center text-xl md:text-2xl shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300"
    //                     >
    //                         ←
    //                     </button>

    //                     {/* Center Text */}
    //                     <div className="flex flex-col items-center">

    //                         <p className="font-work text-[#5c5c5c] text-[15px] md:text-[17px] tracking-wide">
    //                             Sample Calculator For
    //                         </p>

    //                         <p className="font-quiche text-lg md:text-xl leading-none text-[#be8c2f] mt-1">
    //                             Shreyas
    //                         </p>

    //                     </div>

    //                     {/* Next Button */}
    //                     <button
    //                         onClick={() => router.push(`/kubera?navbar=${navbar}&footer=${footer}`)}
    //                         className="w-12 h-12 md:w-14 cursor-pointer md:h-14 rounded-full bg-[#be8c2f] text-white flex items-center justify-center text-xl md:text-2xl shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300"
    //                     >
    //                         →
    //                     </button>

    //                 </div>

    //             </div>
    //         </div>

    //         {/* View More */}
    //         {metal !== "diamond" && (

    //             <div className="mt-5 text-center">

    //                 <button
    //                     onClick={() =>
    //                         setIsVisible(!isVisible)
    //                     }
    //                     className="bg-[#be8c2f] text-white px-8 py-3 rounded-full font-work hover:scale-105 transition-all duration-300"
    //                 >
    //                     {isVisible
    //                         ? "View Less"
    //                         : "View More"}
    //                 </button>

    //             </div>

    //         )}

    //     </div>
    // );
};

export default Shreyas;