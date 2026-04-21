import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Card } from '../../../components/ui/Card'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { createIssue, fetchIssueById, issuesSelectors, updateIssue } from '../issueSlice'
import { IssueForm, type IssueFormValues } from '../components/IssueForm'

export default function IssueEditorPage() {
  const { issueId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const issue = useAppSelector((state) =>
    issueId ? issuesSelectors.selectById(state, issueId) : undefined,
  )
  const loading = useAppSelector((state) => state.issues.mutationStatus === 'loading')

  useEffect(() => {
    if (issueId && !issue) {
      void dispatch(fetchIssueById(issueId))
    }
  }, [dispatch, issue, issueId])

  const handleSubmit = async (values: IssueFormValues) => {
    if (issueId) {
      await dispatch(updateIssue({ id: issueId, payload: values })).unwrap()
      toast.success('Issue updated.')
      navigate(`/issues/${issueId}`)
      return
    }

    const created = await dispatch(createIssue(values)).unwrap()
    toast.success('Issue created.')
    navigate(`/issues/${created.id}`)
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {issueId ? 'Edit issue' : 'Create issue'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Keep descriptions actionable and concise for faster triage.
        </p>
      </header>
      <Card>
        <IssueForm
          key={issueId ?? 'new-issue'}
          initialValues={
            issue
              ? {
                  title: issue.title,
                  description: issue.description,
                  priority: issue.priority,
                  status: issue.status,
                }
              : undefined
          }
          loading={loading}
          onSubmit={handleSubmit}
        />
      </Card>
    </section>
  )
}
