from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'size'
    max_page_size = 100
    count = property(lambda self: self.page.paginator.count)

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'page_size': self.page_size,
            'page': self.page.number,
            'results': data
        })
    
    def paginate(self, queryset, request, view=None, serializer=None):
        self.page_size = request.query_params.get('page_size', self.page_size)
        results = super().paginate_queryset(queryset, request, view)
        return self.get_paginated_response(serializer(results, many=True).data)
