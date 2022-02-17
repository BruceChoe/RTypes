import { Mongo } from 'meteor/mongo';

export const Comms = new Mongo.Collection('comms'); // collection used to send the client a notification to perform an event