#! /bin/bash -l

if [ "$APPLICATION_STAGE" != "production" ] && [ "$APPLICATION_STAGE" != "development" ]
then
        echo "This job can't be exeucted on $APPLICATION_STAGE environment"
        exit 0
fi

if [ -z $EVENT_STORE_CONNECTION_STRING ]
then
    echo "Connection is missing!"
    exit 1
fi

echo "Launching job [RELANCER ABANDON SANS PREUVE]"

npm exec ts-node-dev ./scripts/cron/relancer-abandon-sans-preuve.ts

exit 0