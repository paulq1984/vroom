import { useEffect, useState } from 'react'
import './App.css'
import TeamView from './views/TeamView'
import DriverView from './views/DriverView'
import RaceView from './views/RaceView'

const URL = 'https://vsr4v2fxrk.execute-api.us-east-2.amazonaws.com/prod/'

const App = () => {
    const [teams, setTeams] = useState(null)
    const [drivers, setDrivers] = useState(null)
    const [races, setRaces] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const [teamsResponse, driversResponse, racesResponse] =
                    await Promise.all([
                        fetch(`${URL}teams`),
                        fetch(`${URL}drivers`),
                        fetch(`${URL}races`),
                    ])

                if (
                    !teamsResponse.ok ||
                    !driversResponse.ok ||
                    !racesResponse.ok
                ) {
                    throw new Error('one or more HTTP failed')
                }

                const [teamsData, driversData, racesData] = await Promise.all([
                    teamsResponse.json(),
                    driversResponse.json(),
                    racesResponse.json(),
                ])

                setTeams(teamsData.body)
                setDrivers(driversData.body)
                setRaces(racesData.body)
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <span className="loading loading-bars loading-xl">
                    Loading Data
                </span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <div role="alert" className="alert alert-error">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Error! {error.message}</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <section>
                {teams && <TeamView teams={teams} drivers={drivers} />}
            </section>
            <section>{drivers && <DriverView drivers={drivers} />}</section>
            <section>{races && <RaceView races={races} />}</section>
        </>
    )
}

export default App
