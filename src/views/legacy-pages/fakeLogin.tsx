import { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import routes from '../../routes'

interface Props {
  request: Request
}

/* Pure component */
export default function FakeLoginPage({ request }: Props) {
  const { error } = (request.query as any) || {}
  return (
    <main role="main">
      <section className="section section-grey">
        <div className="container">
          <form action={routes.LOGIN_ACTION} method="post" name="form">
            <h3 id="login">Je m‘identifie</h3>
            {!!error && (
              <div className="notification error" {...dataId('error-message')}>
                {error}
              </div>
            )}
            <div className="form__group">
              <label htmlFor="email">Courrier électronique</label>
              <input type="email" name="email" id="email" {...dataId('email-field')} />
              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
                {...dataId('submit-button')}
              >
                Je m‘identifie
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
