import { Mongo } from 'meteor/mongo';

// collection used to send the client a notification to perform an event
export const Comms = new Mongo.Collection('comms');