import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const ReviewsList = ({ reviews }) => (
  <Table selectable={false}>
    <TableHead displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow>
        <TableCell>User</TableCell>
        <TableCell>General Rate</TableCell>
        <TableCell>Traveled with</TableCell>
        <TableCell>Travel Date</TableCell>
        <TableCell>Review Submission Date</TableCell>
        <TableCell>Review</TableCell>
      </TableRow>
    </TableHead>
    <TableBody displayRowCheckbox={false}>
      {
        reviews.map((review, index) => {
          const userName = review.get('user') ? review.get('user') : 'Unknown';
          const generalRate = review.getIn(['ratings', 'general', 'general']);
          const travelWith = review.get('traveledWith');
          const comment = review.getIn(['texts', 'nl']) ? review.getIn(['texts', 'nl']) : '';
          const travel = review.get('travelDate').substr(0, 10);
          const submission = review.get('entryDate').substr(0, 10);

          return (
            <TableRow key={index}>
              <TableCell>
                {userName}
              </TableCell>
              <TableCell>
                {generalRate}
              </TableCell>
              <TableCell>
                {travelWith}
              </TableCell>
              <TableCell>
                {travel}
              </TableCell>
              <TableCell>
                {submission}
              </TableCell>
              <TableCell>
                {comment}
              </TableCell>
            </TableRow>
          );
        })
      }
    </TableBody>
  </Table>
);

ReviewsList.propTypes = {
  reviews: ImmutablePropTypes.list.isRequired
};

export default ReviewsList;
