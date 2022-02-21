import React from 'react'
import {
  ItemDate,
  ItemTitle,
  ContentArea,
  CurrentIcon,
  PastIcon,
  UnvalidatedStepIcon,
  InfoItem,
} from '.'
import { ModificationRequestItemProps } from '../helpers/extractModificationRequestsItemProps'
import { CancelledStepIcon } from './cancelledStepIcon'

export const ModificationRequestItem = (props: ModificationRequestItemProps) => {
  const { status } = props
  switch (status) {
    case 'envoyée':
    case 'en instruction':
      return <Submitted {...{ ...props, status }} />
    case 'rejetée':
      return <Rejected {...{ ...props, status }} />
    case 'acceptée':
      return <Accepted {...{ ...props, status }} />
    case 'annulée':
      return <Cancelled {...{ ...props, status }} />
    case 'en attente de confirmation':
      return <ConfirmationRequested {...props} />
    case 'demande confirmée':
      return <RequestConfirmed {...props} />
  }
}

type SubmittedProps = ModificationRequestItemProps & {
  status: 'envoyée' | 'en instruction'
}

const Submitted = (props: SubmittedProps) => {
  const { date, authority, role, status } = props
  const displayWarning = (role === 'admin' && authority === 'dgec') || role === authority
  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-center">
            <ItemDate date={date} />
          </div>
          {displayWarning && (
            <div className="align-center mb-1">
              <InfoItem message={status === 'envoyée' ? 'à traiter' : 'réponse à envoyer'} />
            </div>
          )}
        </div>
        <Title {...props} />
      </ContentArea>
    </>
  )
}

type RejectedProps = ModificationRequestItemProps & {
  status: 'rejetée'
}

const Rejected = (props: RejectedProps) => {
  const { date, url } = props
  return (
    <>
      <UnvalidatedStepIcon />
      <ContentArea>
        <ItemDate date={date} />
        <Title {...props} />
        {url && <a href={url}>Voir le courrier de réponse</a>}
      </ContentArea>
    </>
  )
}

type AcceptedProps = ModificationRequestItemProps & {
  status: 'acceptée'
}

const Accepted = (props: AcceptedProps) => {
  const { date, url } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <Title {...props} />
        {url && <a href={url}>Voir le courrier de réponse</a>}
      </ContentArea>
    </>
  )
}

type CancelledProps = ModificationRequestItemProps & {
  status: 'annulée'
}

const Cancelled = (props: CancelledProps) => {
  const { date } = props
  return (
    <>
      <CancelledStepIcon />
      <ContentArea>
        <ItemDate date={date} />
        <Title {...props} />
        <p className="p-0 m-0">Demande annulée par le porteur de projet</p>
      </ContentArea>
    </>
  )
}

const ConfirmationRequested = (props: ModificationRequestItemProps) => {
  const { date, url, role } = props
  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-center">
            <ItemDate date={date} />
          </div>
          {role === 'porteur-projet' && (
            <div className="align-center mb-1">
              <InfoItem message="demande de confirmation à traiter" />
            </div>
          )}
        </div>
        <ItemTitle title={`Demande d'abandon en attente d'une confirmation du Porteur de projet`} />
        {url && <a href={url}>Voir le courrier de réponse</a>}
      </ContentArea>
    </>
  )
}

const RequestConfirmed = (props: ModificationRequestItemProps) => {
  const { date, role } = props
  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-center">
            <ItemDate date={date} />
          </div>
          {['admin', 'dreal'].includes(role) && (
            <div className="align-center mb-1">
              <InfoItem message="à traiter" />
            </div>
          )}
        </div>
        <ItemTitle title={`Demande d'abandon confirmée par le porteur de projet`} />
      </ContentArea>
    </>
  )
}

const Title = (
  props: { status: ModificationRequestItemProps['status'] } & (
    | { modificationType: 'delai'; delayInMonths: number }
    | { modificationType: 'abandon' | 'recours' }
  )
) => {
  const { status, modificationType } = props

  const libelleTypeDemande: { [key in ModificationRequestItemProps['modificationType']]: string } =
    {
      abandon: `d'abandon`,
      delai: `de prolongation de délai`,
      recours: `de recours`,
    }

  return (
    <>
      <ItemTitle title={`Demande ${libelleTypeDemande[modificationType]} ${status}`} />
      {modificationType === 'delai' && (
        <p className="p-0 m-0">Délai demandé : {props.delayInMonths} mois</p>
      )}
    </>
  )
}
