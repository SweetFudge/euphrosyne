import type { Job } from '../types/job'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <article className="job-card">
      <h2>{job.title}</h2>
      <p>
        {job.company}
        {job.location ? ` · ${job.location}` : ''}
      </p>
    </article>
  )
}
