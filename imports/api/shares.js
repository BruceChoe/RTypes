import { Mongo } from 'meteor/mongo';

 // collection that tells the website which users (other than the visualization author) can access a visualization
export const Shares = new Mongo.Collection("shares");