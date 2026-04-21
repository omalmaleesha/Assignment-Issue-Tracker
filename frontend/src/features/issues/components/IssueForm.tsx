import { useEffect, useRef, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'
import type { IssuePriority, IssueStatus } from '../../../types'

export interface IssueFormValues {
  title: string
  description: string
  priority: IssuePriority
  status: IssueStatus
}

type FormErrors = Partial<Record<keyof IssueFormValues, string>>

interface IssueFormProps {
  initialValues?: IssueFormValues | undefined
  loading: boolean
  onSubmit: (values: IssueFormValues) => Promise<void>
}

const defaults: IssueFormValues = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'open',
}

export function IssueForm({ initialValues, loading, onSubmit }: IssueFormProps) {
  const [values, setValues] = useState<IssueFormValues>(initialValues ?? defaults)
  const [errors, setErrors] = useState<FormErrors>({})
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    // initialize once if provided
    if (initialValues) {
      // schedule to next tick to avoid synchronous setState in effect
      const id = setTimeout(() => setValues(initialValues), 0)
      return () => clearTimeout(id)
    }
    return undefined
  }, [initialValues])

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (values.title.trim().length < 4) {
      nextErrors.title = 'Title must be at least 4 characters.'
    }

    if (values.description.trim().length < 10) {
      nextErrors.description = 'Description must be at least 10 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return
    await onSubmit(values)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        ref={titleRef}
        label="Title"
        name="title"
        placeholder="e.g. Cannot save issue from mobile"
        value={values.title}
        error={errors.title}
        onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
      />

      <Textarea
        label="Description"
        name="description"
        placeholder="Describe the issue in detail..."
        value={values.description}
        error={errors.description}
        onChange={(event) =>
          setValues((prev) => ({
            ...prev,
            description: event.target.value,
          }))
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Priority"
          name="priority"
          value={values.priority}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, priority: event.target.value as IssuePriority }))
          }
        />

        <Select
          label="Status"
          name="status"
          value={values.status}
          options={[
            { value: 'open', label: 'Open' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'resolved', label: 'Resolved' },
            { value: 'closed', label: 'Closed' },
          ]}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, status: event.target.value as IssueStatus }))
          }
        />
      </div>

      <Button type="submit" loading={loading}>
        Save issue
      </Button>
    </form>
  )
}
