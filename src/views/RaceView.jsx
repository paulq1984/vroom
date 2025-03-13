import React, { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

const RaceView = ({ races }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRace, setSelectedRace] = useState(null)

    if (!races) {
        return <div>No Races Data Found</div>
    }

    if (races) {
        races = JSON.parse(races)
    }

    const openModal = (race) => {
        setSelectedRace(race)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedRace(null)
    }

    return (
        <div className="h-full w-full flex items-center justify-center bg-slate-900">
            <div className="grid h-full w-full grid-cols-6 grid-rows-4 gap-2 p-4 xl:m-8 lg:m-8 md:m-4">
                {' '}
                {/* Reduced padding and margins */}
                {races.map((race, idx) => {
                    return (
                        <div
                            className="col-span-1 row-span-1 rounded-xl p-2 flex items-center justify-center text-xl text-center font-bold bg-lime-900"
                            onClick={() => openModal(race)}
                        >
                            {race.raceName}
                        </div>
                    )
                })}
            </div>

            {/* Modal component will go here */}
            {isModalOpen && (
                <RaceModal race={selectedRace} onClose={closeModal} />
            )}
        </div>
    )
}

const RaceModal = ({ race, onClose }) => {
    if (!race) return null

    const formatDateTime = (dateString, timeString) => {
        if (!dateString || !timeString) return 'N/A'

        const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

        try {
            const combinedDateTime = parseISO(`${dateString}T${timeString}`)

            const formattedDateTime = formatInTimeZone(
                combinedDateTime,
                localTimezone,
                'EEEE do MMMM, HH:mm'
            )

            return formattedDateTime
        } catch (err) {
            console.error('Error formatting date and time:', err)
            return 'Invalid Date'
        }
    }

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
            <div className="bg-black p-6 rounded-lg w-1/2">
                <h2 className="text-2xl font-bold mb-4">{race.raceName}</h2>
                <p>{race.Circuit.circuitName}</p>
                <p>
                    {race.Circuit.Location.locality},{' '}
                    {race.Circuit.Location.country}
                </p>
                <p>
                    FP1:{' '}
                    {formatDateTime(
                        race.FirstPractice.date,
                        race.FirstPractice.time
                    )}
                </p>
                {race.hasOwnProperty('SecondPractice') && (
                    <p>
                        FP2:{' '}
                        {formatDateTime(
                            race.SecondPractice.date,
                            race.SecondPractice.time
                        )}
                    </p>
                )}
                {race.hasOwnProperty('ThirdPractice') && (
                    <p>
                        FP3:{' '}
                        {formatDateTime(
                            race.ThirdPractice.date,
                            race.ThirdPractice.time
                        )}
                    </p>
                )}
                {race.hasOwnProperty('SprintQualifying') && (
                    <p>
                        Sprint Qualifying:{' '}
                        {formatDateTime(
                            race.SprintQualifying.date,
                            race.SprintQualifying.time
                        )}
                    </p>
                )}
                {race.hasOwnProperty('Sprint') && (
                    <p>
                        Sprint Race:{' '}
                        {formatDateTime(race.Sprint.date, race.Sprint.time)}
                    </p>
                )}
                {race.hasOwnProperty('Qualifying') && (
                    <p>
                        Qualifying:{' '}
                        {formatDateTime(
                            race.Qualifying.date,
                            race.Qualifying.time
                        )}
                    </p>
                )}
                <p>Race: {formatDateTime(race.date, race.time)}</p>

                <button
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default RaceView
