import { createGraphiQLFetcher } from '@graphiql/toolkit'
import { useStore } from '@nanostores/react'
import { GraphiQL } from 'graphiql'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'

import { MainLayout, OrchestratePage, SetupPage } from '~/pages'
import { endpointURLAtom } from '~/store'

export function Router() {
  const endpointURL = useStore(endpointURLAtom)
  const RouterType = import.meta.env.DEV ? BrowserRouter : HashRouter

  return (
    <RouterType>
      <Routes>
        {/* Remount the authenticated tree per endpoint and token so query
            observers never keep a cache from another account. */}
        <Route path="/" element={<MainLayout key={`${endpointURL}|${token}`} />}>
          <Route index element={<OrchestratePage />} />
        </Route>

        <Route path="/setup" element={<SetupPage />} />

        {endpointURL && (
          <Route
            path="/graphiql"
            element={
              <GraphiQL
                fetcher={createGraphiQLFetcher({
                  url: endpointURL,
                })}
              />
            }
          />
        )}
      </Routes>
    </RouterType>
  )
}
