'use client'
import React, { useState } from 'react'

interface SearchBarProps {
  placeholder?: string
  onSearch: (value: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
}) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className='flex gap-2 mb-4'>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className='flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <button
        type='submit'
        className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar
