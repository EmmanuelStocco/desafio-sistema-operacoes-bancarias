'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { accountAPI } from '@/lib/api'

interface Transaction {
  id: number
  type: 'deposit' | 'withdraw' | 'transfer'
  amount: number
  originAccountId: string | null
  destinationAccountId: string | null
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [accountId, setAccountId] = useState('')
  const [consultedAccountId, setConsultedAccountId] = useState('') // ID da conta que foi realmente consultada
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form states
  const [depositAmount, setDepositAmount] = useState('')
  const [depositAccount, setDepositAccount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAccount, setWithdrawAccount] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [transferOrigin, setTransferOrigin] = useState('')
  const [transferDestination, setTransferDestination] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const loadBalance = async () => {
    if (!accountId) {
      setError('Digite o ID da conta')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await accountAPI.getBalance(accountId)
      setBalance(response.balance)
      setConsultedAccountId(accountId) // Salva o ID que foi realmente consultado
      await loadTransactions()
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Conta não encontrada')
      } else {
        setError('Erro ao carregar saldo')
      }
      setBalance(null)
      setConsultedAccountId('') // Limpa se der erro
    } finally {
      setLoading(false)
    }
  }

  const loadTransactions = async () => {
    if (!consultedAccountId) return
    try {
      const response = await accountAPI.getTransactions(consultedAccountId)
      setTransactions(response.transactions)
    } catch (err) {
      console.error('Erro ao carregar transações:', err)
    }
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await accountAPI.deposit({
        type: 'deposit',
        destination: depositAccount,
        amount: parseFloat(depositAmount),
      })
      setSuccess('Depósito realizado com sucesso!')
      setDepositAmount('')
      setDepositAccount('')
      if (depositAccount === consultedAccountId) {
        await loadBalance()
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao realizar depósito')
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await accountAPI.withdraw({
        type: 'withdraw',
        origin: withdrawAccount,
        amount: parseFloat(withdrawAmount),
      })
      setSuccess('Saque realizado com sucesso!')
      setWithdrawAmount('')
      setWithdrawAccount('')
      if (withdrawAccount === consultedAccountId) {
        await loadBalance()
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Saldo insuficiente')
      } else if (err.response?.status === 404) {
        setError('Conta não encontrada')
      } else {
        setError(err.response?.data?.error || 'Erro ao realizar saque')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await accountAPI.transfer({
        type: 'transfer',
        origin: transferOrigin,
        destination: transferDestination,
        amount: parseFloat(transferAmount),
      })
      setSuccess('Transferência realizada com sucesso!')
      setTransferAmount('')
      setTransferOrigin('')
      setTransferDestination('')
      if (transferOrigin === consultedAccountId || transferDestination === consultedAccountId) {
        await loadBalance()
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Saldo insuficiente')
      } else if (err.response?.status === 404) {
        setError('Conta não encontrada')
      } else {
        setError(err.response?.data?.error || 'Erro ao realizar transferência')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('Tem certeza que deseja resetar todo o sistema? Isso apagará todas as contas e transações.')) {
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await accountAPI.reset()
      setSuccess('Sistema resetado com sucesso!')
      setBalance(null)
      setTransactions([])
      setAccountId('')
      setConsultedAccountId('')
    } catch (err: any) {
      console.error('Erro ao resetar:', err)
      setError(err.response?.data?.error || 'Erro ao resetar sistema')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Consultar Saldo */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Consultar Saldo</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="ID da Conta"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={loadBalance}
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Consultar
              </button>
            </div>
            {balance !== null && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600">Saldo da Conta {consultedAccountId}</p>
                <p className="text-3xl font-bold text-indigo-700">R$ {balance.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Reset */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sistema</h2>
            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              Resetar Sistema
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Depósito */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Depósito</h2>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conta Destino</label>
                <input
                  type="text"
                  value={depositAccount}
                  onChange={(e) => setDepositAccount(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="ID da Conta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Depositar
              </button>
            </form>
          </div>

          {/* Saque */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Saque</h2>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conta Origem</label>
                <input
                  type="text"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="ID da Conta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
              >
                Sacar
              </button>
            </form>
          </div>

          {/* Transferência */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Transferência</h2>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conta Origem</label>
                <input
                  type="text"
                  value={transferOrigin}
                  onChange={(e) => setTransferOrigin(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="ID da Conta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conta Destino</label>
                <input
                  type="text"
                  value={transferDestination}
                  onChange={(e) => setTransferDestination(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="ID da Conta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                Transferir
              </button>
            </form>
          </div>
        </div>

        {/* Histórico de Transações */}
        {consultedAccountId && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Histórico de Transações</h2>
            {transactions.length === 0 ? (
              <p className="text-gray-500">Nenhuma transação encontrada para esta conta.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Tipo</th>
                      <th className="text-left py-2 px-4">Valor</th>
                      <th className="text-left py-2 px-4">Origem</th>
                      <th className="text-left py-2 px-4">Destino</th>
                      <th className="text-left py-2 px-4">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              transaction.type === 'deposit'
                                ? 'bg-green-100 text-green-800'
                                : transaction.type === 'withdraw'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {transaction.type === 'deposit'
                              ? 'Depósito'
                              : transaction.type === 'withdraw'
                              ? 'Saque'
                              : 'Transferência'}
                          </span>
                        </td>
                        <td className="py-2 px-4 font-semibold">R$ {parseFloat(transaction.amount.toString()).toFixed(2)}</td>
                        <td className="py-2 px-4">{transaction.originAccountId || '-'}</td>
                        <td className="py-2 px-4">{transaction.destinationAccountId || '-'}</td>
                        <td className="py-2 px-4 text-sm text-gray-600">
                          {new Date(transaction.createdAt).toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

