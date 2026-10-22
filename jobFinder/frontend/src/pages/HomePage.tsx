import { useEffect, useState } from 'react'
import JobCard from '../components/JobCard'
import SearchBar from '../components/SearchBar'
import { jobService } from '../services/jobService'
import type { Job } from '../types/job'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    jobService
      .search(query)
      .then((result) => {
        setJobs(result)
        setError(null)
      })
      .catch((e: Error) => setError(e.message))
  }, [query])

  return (
    <div className="container">
      <h1>jobFinder</h1>
      <SearchBar value={query} onChange={setQuery} />
      {error && <p role="alert">{error}</p>}
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
      {!error && jobs.length === 0 && <p>Aucune offre pour le moment.</p>}
    </div>
  )
}
