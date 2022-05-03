import { Mongo } from 'meteor/mongo';

// collection that stores data related to visualizations,
// such as the author, the creation time, and the visualization image URLs
export const Visualizations = new Mongo.Collection('visualizations');