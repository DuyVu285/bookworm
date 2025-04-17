import pytest
from datetime import datetime
from sqlalchemy.sql import label, desc, and_, or_
from sqlalchemy import BooleanClauseList, func, cast
from sqlmodel import Float
from sqlalchemy.sql.elements import UnaryExpression
from sqlalchemy.sql.selectable import Select

from app.models.book_model import Book
from app.models.discount_model import Discount
from app.models.review_model import Review
from app.utils.book_query_helper import BookQueryHelper


@pytest.fixture
def now():
    return datetime.now()


class TestBookQueryHelper:
    def test_build_sort_expr_on_sale(self):
        """Test that 'on sale' sort returns correct label expression"""
        result = BookQueryHelper.build_sort_expr("on sale")
        expected = label("sub_price", Book.book_price - Discount.discount_price)
        assert str(result) == str(expected)

    def test_build_sort_expr_price_asc(self):
        """Test that 'price_asc' sort returns book_price"""
        result = BookQueryHelper.build_sort_expr("price_asc")
        assert result == Book.book_price

    def test_build_sort_expr_price_desc(self):
        """Test that 'price_desc' sort returns descending book_price"""
        result = BookQueryHelper.build_sort_expr("price_desc")
        assert isinstance(result, UnaryExpression)
        assert str(result) == str(desc(Book.book_price))

    def test_build_sort_expr_popularity(self):
        """Test that 'popularity' sort returns descending review count"""
        result = BookQueryHelper.build_sort_expr("popularity")
        assert isinstance(result, UnaryExpression)
        assert str(result) == str(desc(func.count(Review.id)))

    def test_build_sort_expr_avg_rating(self):
        """Test that 'avg_rating' sort returns descending average rating"""
        result = BookQueryHelper.build_sort_expr("avg_rating")
        assert isinstance(result, UnaryExpression)
        assert str(result) == str(desc(func.avg(cast(Review.rating_star, Float))))

    def test_build_sort_expr_default(self):
        """Test that default sort returns on sale expression"""
        result = BookQueryHelper.build_sort_expr("invalid_sort")
        expected = label("sub_price", Book.book_price - Discount.discount_price)
        assert str(result) == str(expected)

    def test_build_base_query_minimal(self, now):
        """Test base query construction with no filters"""
        query = BookQueryHelper.build_base_query(now)

        # Verify basic structure
        assert isinstance(query, Select)

        # Check joins
        joins = [str(j) for j in query.get_final_froms()]
        assert any("discount" in j.lower() for j in joins)
        assert any("review" in j.lower() for j in joins)

        # Check where clause
        where_clause = query.whereclause
        assert isinstance(where_clause, BooleanClauseList)

        # Check group by
        group_by_strs = [str(g).lower() for g in query._group_by_clause]

        assert any("book.id" in g for g in group_by_strs)
        assert any("discount.discount_price" in g for g in group_by_strs)

    def test_build_base_query_with_category(self, now):
        query = BookQueryHelper.build_base_query(now, category_id=1)
        where_clauses = self.extract_conditions(query.whereclause)
        print("CATEGORY WHERE:", [str(c) for c in where_clauses])
        assert any("book.category_id" in str(c) for c in where_clauses)

    def test_build_base_query_with_author(self, now):
        query = BookQueryHelper.build_base_query(now, author_id=1)
        where_clauses = self.extract_conditions(query.whereclause)
        print("AUTHOR WHERE:", [str(c) for c in where_clauses])
        assert any("book.author_id" in str(c) for c in where_clauses)

    def test_build_base_query_with_min_rating(self, now):
        query = BookQueryHelper.build_base_query(now, min_rating=4.0)
        having = query._having_criteria[0]
        assert "avg(CAST(review.rating_star AS FLOAT))" in str(having)

    def test_build_base_query_with_all_filters(self, now):
        query = BookQueryHelper.build_base_query(
            now, category_id=1, author_id=2, min_rating=3.5
        )
        where_clauses = self.extract_conditions(query.whereclause)
        print("ALL FILTERS WHERE:", [str(c) for c in where_clauses])
        assert any("book.category_id" in str(c) for c in where_clauses)
        assert any("book.author_id" in str(c) for c in where_clauses)
        having = query._having_criteria[0]
        assert "avg(CAST(review.rating_star AS FLOAT))" in str(having)

    def extract_conditions(self, expr):
        if isinstance(expr, BooleanClauseList):
            return list(expr.clauses)
        return [expr]
