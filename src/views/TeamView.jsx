import React, { useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'

const ONE_SECOND = 1000
const AUTO_DELAY = ONE_SECOND * 10
const DRAG_BUFFER = 50

const SPRING_OPTIONS = {
    type: 'spring',
    mass: 3,
    stiffness: 400,
    damping: 50,
}

const CAR_URL = 'https://vroombucket2025.s3.us-east-2.amazonaws.com/cars/'

const teamLogoURL =
    'https://vroombucket2025.s3.us-east-2.amazonaws.com/large-logos/'

const driverImage =
    'https://vroombucket2025.s3.us-east-2.amazonaws.com/drivers/'

const TeamView = ({ teams, drivers }) => {
    const [teamIndex, setTeamIndex] = useState(0)

    if (teams && drivers) {
        teams = JSON.parse(teams)
        drivers = JSON.parse(drivers)
    }

    const dragX = useMotionValue(0)

    useEffect(() => {
        const intervalRef = setInterval(() => {
            const x = dragX.get()

            if (x === 0) {
                setTeamIndex((pv) => {
                    if (pv === teams.length - 1) {
                        return 0
                    }

                    return pv + 1
                })
            }
        }, AUTO_DELAY)

        return () => clearInterval(intervalRef)
    }, [])

    const onDragEnd = () => {
        const x = dragX.get()

        if (x <= -DRAG_BUFFER && teamIndex < teams.length - 1) {
            setTeamIndex((pv) => pv + 1)
        } else if (x >= DRAG_BUFFER && teamIndex > 0) {
            setTeamIndex((pv) => pv - 1)
        }
    }

    return (
        <div className="relative overflow-hidden  bg-slate-900">
            <motion.div
                drag="x"
                dragConstraints={{
                    left: 0,
                    right: 0,
                }}
                style={{
                    x: dragX,
                }}
                animate={{
                    translateX: `-${teamIndex * 100}%`,
                }}
                transition={SPRING_OPTIONS}
                onDragEnd={onDragEnd}
                className="flex cursor-grab items-center active:cursor-grabbing"
            >
                <SlideGrid
                    teamIndex={teamIndex}
                    teams={teams}
                    drivers={drivers}
                />
            </motion.div>
        </div>
    )
}

const SlideGrid = ({ teamIndex, teams, drivers }) => {
    const findDriverById = (driverId, drivers) => {
        if (!drivers || !Array.isArray(drivers)) {
            return null
        }

        return drivers.find((driver) => driver.id === driverId) || null
    }

    return (
        <>
            {teams.map((team, idx) => {
                const driver1 = findDriverById(team.driver1, drivers)
                const driver2 = findDriverById(team.driver2, drivers)
                return (
                    <motion.div
                        animate={{
                            scale: teamIndex === idx ? 0.95 : 0.85,
                        }}
                        transition={SPRING_OPTIONS}
                        className="aspect-video w-screen shrink-0  bg-slate-900"
                        key={idx}
                    >
                        <div className="h-screen w-full flex items-center justify-center">
                            <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-3 p-20 xl:m-64 lg:m-32 md:m-16">
                                <div className="col-span-2 row-span-1 rounded-xl flex flex-col items-center justify-center bg-white p-10">
                                    <img
                                        src={`${teamLogoURL}${team.carImage}.png`}
                                        alt=""
                                    />
                                </div>
                                <div className="col-span-1 row-span-1 rounded-xl stats p-8 justify-center bg-black">
                                    <div className="stat-title text-[20px] text-white font-semibold">
                                        First Entry
                                    </div>
                                    <div className="stat-value">
                                        {team.stats.firstEntry}
                                    </div>
                                </div>
                                <div className="col-span-1 row-span-1 rounded-xl bg-orange-400 stats p-8">
                                    <div className="stat-value text-black">
                                        {team.stats.wins}
                                    </div>
                                    <div className="stat-title text-[20px] text-black font-semibold">
                                        Race Wins
                                    </div>
                                </div>

                                <div className="col-span-1 row-span-1 rounded-xl flex flex-col text-xl items-center justify-center glass">
                                    {driver1 ? (
                                        <>
                                            <div className="avatar">
                                                <div className="w-32 rounded-lg shadow-2xl">
                                                    <img
                                                        src={`${driverImage}${driver1.code}.png`}
                                                        alt="Driver Image"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-2 flex items-center justify-center">
                                                {/* Add margin top for spacing */}
                                                <p
                                                    className={`font-semibold mr-2 p-2 border-r-4 ${team.carImage}DriverInfo`}
                                                >
                                                    {driver1.id}
                                                </p>
                                                <p className="font-semibold mr-2">
                                                    {driver1.code}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        'Driver 1 not found'
                                    )}
                                </div>
                                <div className="col-span-2 row-span-1 rounded-xl glass p-8 items-center justify-center text-xl text-center">
                                    <>
                                        <img
                                            src={`${CAR_URL}${team.carImage}.png`}
                                            alt=""
                                        />
                                        <div className="mt-2 flex items-center justify-center">
                                            <p className="font-semibold mr-2">
                                                Chassis: {team.chassis}
                                            </p>
                                        </div>
                                    </>
                                </div>
                                <div className="col-span-1 row-span-1 rounded-xl flex flex-col text-xl items-center justify-center glass">
                                    {driver2 ? (
                                        <>
                                            <div className="avatar">
                                                <div className="w-32 rounded-lg shadow-2xl">
                                                    <img
                                                        src={`${driverImage}${driver2.code}.png`}
                                                        alt="Driver Image"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-2 flex items-center justify-center">
                                                {/* Add margin top for spacing */}
                                                <p
                                                    className={`font-semibold mr-2 p-2 border-r-4 ${team.carImage}DriverInfo`}
                                                >
                                                    {driver2.id}
                                                </p>
                                                <p className="font-semibold mr-2">
                                                    {driver2.code}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        'Driver 1 not found'
                                    )}
                                </div>

                                <div className="col-span-1 row-span-1 rounded-xl p-2 flex items-center justify-center text-3xl text-center font-bold bg-neutral-700">
                                    <p>Power Unit: {team.powerUnit}</p>
                                </div>
                                <div className="col-span-1 row-span-1 rounded-xl bg-accent p-2 flex items-center justify-center text-3xl text-center font-bold">
                                    <img
                                        className="size-[3.5em] p-1"
                                        src={`https://flagsapi.com/${team.nationality}/flat/64.png`}
                                        alt=""
                                    />
                                </div>
                                <div className="col-span-1 row-span-1 rounded-xl bg-rose-200 stat p-8 items-center justify-center">
                                    <div className="stat-title text-[20px] text-black font-semibold">
                                        Pole Positions:
                                    </div>
                                    <div className="stat-value text-black">
                                        {team.stats.poles}
                                    </div>
                                </div>
                                <div className="col-span-1 row-span-1 rounded-xl stat p-8 items-center justify-center bg-yellow-300">
                                    <div className="stat-value text-black">
                                        {team.stats.wordChampionships}
                                    </div>
                                    <div className="stat-title text-[16px] text-black font-semibold">
                                        World
                                    </div>
                                    <div className="stat-title text-[16px] text-black font-semibold">
                                        Constructor
                                    </div>
                                    <div className="stat-title text-[16px] text-black font-semibold">
                                        Championships
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </>
    )
}

export default TeamView
