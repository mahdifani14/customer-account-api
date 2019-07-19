import { connect } from 'react-redux';
import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import config from '../../config';
import Search from './components/Search/Search';
import Pagination from '../Components/Pagination/Pagination';
import ReviewsList from './components/ReviewsList/ReviewsList';
import ReviewsRating from './components/ReviewsRating/ReviewsRating';
import { fetchReviews, fetchReviewsRatingAverages } from './ReviewsActions';
import { getReviews, getReviewsRatingAverage, getReviewsTotal } from './ReviewsReducer';

// Get Browser History
import browserHistory from '../../history';

class ReviewsListPage extends Component {
  static propTypes = {
    reviews: ImmutablePropTypes.list.isRequired,
    totalReviews: PropTypes.number.isRequired,
    reviewsRatingAverages: PropTypes.object.isRequired,
    fetchReviews: PropTypes.func.isRequired,
    fetchReviewsRatingAverages: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  };

  state = {
    pageNum: 0,
  };

  componentDidMount() {
    this.props.fetchReviewsRatingAverages();
    const perPage = config.reviewsPerPage;
    this.props.fetchReviews(
      this.props.location.query,
      perPage,
      0
    );
  }

  componentWillReceiveProps(nextProps) {
    const perPage = config.reviewsPerPage;
    const shouldUpdate = nextProps.location.query.search !== this.props.location.query.search;
    if (shouldUpdate) {
      nextProps.fetchReviews(
        nextProps.location.query,
        perPage,
        0
      );
    }
  }

  handlePageClick = (data) => {
    const perPage = config.reviewsPerPage;
    const selected = data.selected;
    this.setState({ pageNum: selected }, () => {
      this.props.fetchReviews(
        this.props.location.query,
        perPage,
        selected
      );
    });
  };

  handleSearchSubmit = (formData) => {
    browserHistory().push({
      pathname: this.props.location.pathname,
      query: {
        search: formData.search
      }
    });
  };

  render() {
    const { totalReviews, reviews, reviewsRatingAverages } = this.props;
    const totalsPage = Math.ceil(totalReviews / config.reviewsPerPage);

    return (
      <div>
        <Search onSubmit={this.handleSearchSubmit}/>
        {reviewsRatingAverages ? <ReviewsRating ratings={reviewsRatingAverages}/> : ''}
        <ReviewsList reviews={reviews}/>
        <Pagination pageClick={this.handlePageClick} total={totalsPage}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const location = ownProps.location;
  return {
    reviews: getReviews(state),
    totalReviews: getReviewsTotal(state),
    reviewsRatingAverages: getReviewsRatingAverage(state),
    location
  };
}

const actions = {
  fetchReviews,
  fetchReviewsRatingAverages
};

export default connect(mapStateToProps, actions)(ReviewsListPage);
