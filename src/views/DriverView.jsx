import { div } from 'motion/react-client'
import React from 'react'

const teamLogURL =
    'https://vroombucket2025.s3.us-east-2.amazonaws.com/small-team-logos/'

const driverImage =
    'https://vroombucket2025.s3.us-east-2.amazonaws.com/drivers/'

const DriverView = ({ drivers }) => {
    if (!drivers) {
        return <div>No Drivers Data Found</div>
    }

    if (drivers) {
        drivers = JSON.parse(drivers)
    }

    return (
        <div className="h-full w-full flex items-center justify-center bg-slate-900">
            <ul className="list rounded-box shadow-md grid grid-cols-4 gap-2">
                {drivers.map((driver, idx) => {
                    const formattedId =
                        driver.id < 10 ? `0${driver.id}` : driver.id

                    return (
                        <li className={`list-row ${driver.team}`}>
                            <div className="items-center justify-center text-xl text-center font-bold">
                                <div className="text-4xl">{formattedId}</div>
                                <div className="text-2xl">{driver.code}</div>
                            </div>

                            <div>
                                <img
                                    className="size-20 rounded-box"
                                    src={`${driverImage}${driver.code}.png`}
                                    alt="Driver Image"
                                />
                            </div>
                            <div className="list-col-grow">
                                <div className="text-xl">
                                    {driver.givenName}
                                </div>
                                <div className="text-xl">
                                    {driver.familyName}
                                </div>
                            </div>
                            <div className="list-col-grow">
                                <div>
                                    <img
                                        className="size-[2.5em] p-1"
                                        src={`${teamLogURL}${driver.team}-logo.png`}
                                        alt=""
                                    />
                                </div>
                                <div>
                                    <img
                                        className="size-[2.5em] p-1"
                                        src={`https://flagsapi.com/${driver.nationality}/flat/64.png`}
                                        alt=""
                                    />
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default DriverView
