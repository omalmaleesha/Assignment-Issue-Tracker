import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Edit3, Trash2, XCircle } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { formatRelativeTime } from '../../../lib/time'
import {
  deleteIssue,
  fetchIssueById,
  issuesSelectors,
  optimisticStatusUpdate,
  updateIssueStatus,
} from '../issueSlice'
import type { IssueStatus } from '../../../types'
import { useEffect } from 'react'

export default function IssueDetailsPage() {
  const { issueId = '' } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const issue = useAppSelector((state) => issuesSelectors.selectById(state, issueId))
  const [pendingStatus, setPendingStatus] = useState<IssueStatus | null>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const mutationStatus = useAppSelector((state) => state.issues.mutationStatus)

  useEffect(() => {
    if (issueId && !issue) {
      void dispatch(fetchIssueById(issueId))
    }
  }, [dispatch, issue, issueId])

  const statusLabel = useMemo(
    () =>
      pendingStatus === 'resolved'
        ? 'Mark this issue as resolved?'
        : 'Mark this issue as closed?',
    [pendingStatus],
  )

  const handleStatusChange = async () => {
    if (!issue || !pendingStatus) return

    dispatch(optimisticStatusUpdate({ id: issue.id, status: pendingStatus }))
    try {
      await dispatch(updateIssueStatus({ id: issue.id, status: pendingStatus })).unwrap()
      toast.success('Issue status updated.')
      setPendingStatus(null)
    } catch {
      toast.error('Could not update status. Please retry.')
      void dispatch(fetchIssueById(issue.id))
    }
  }

  const handleDeleteIssue = async () => {
    if (!issue) return

    try {
      const response = await dispatch(deleteIssue(issue.id)).unwrap()
      toast.success(response.message ?? 'Issue deleted successfully')
      setDeleteModalOpen(false)
      navigate('/issues', { replace: true })
    } catch {
      toast.error('Could not delete issue. Please retry.')
    }
  }

  if (!issue) {
    return (
      <Card>
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading issue details...</p>
      </Card>
    )
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" onClick={() => navigate('/issues')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <div className="flex flex-wrap gap-2">
          <Link to={`/issues/${issue.id}/edit`}>
            <Button variant="secondary">
              <Edit3 size={16} /> Edit
            </Button>
          </Link>
          <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
            <Trash2 size={16} /> Delete
          </Button>
          {issue.status !== 'resolved' ? (
            <Button variant="primary" onClick={() => setPendingStatus('resolved')}>
              <CheckCircle2 size={16} /> Resolve
            </Button>
          ) : null}
          {issue.status !== 'closed' ? (
            <Button variant="danger" onClick={() => setPendingStatus('closed')}>
              <XCircle size={16} /> Close
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">{issue.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Updated {formatRelativeTime(issue.updatedAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge value={issue.status} />
            <Badge value={issue.priority} />
          </div>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">
          {issue.description}
        </p>
      </Card>

      <Modal isOpen={Boolean(pendingStatus)} onClose={() => setPendingStatus(null)} title="Confirm action">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">{statusLabel}</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setPendingStatus(null)}>
              Cancel
            </Button>
            <Button variant={pendingStatus === 'closed' ? 'danger' : 'primary'} onClick={handleStatusChange}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete issue">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete this issue? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={mutationStatus === 'loading'}
              onClick={handleDeleteIssue}
            >
              Delete issue
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  )
}
