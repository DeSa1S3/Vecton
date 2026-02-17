from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError


def custom_exception_handler(exc, context):

    response = exception_handler(exc, context)
    
    if response is not None:
        response.data['status_code'] = response.status_code
        return response
    
    if isinstance(exc, IntegrityError):
        return Response(
            {
                'error': 'Database integrity error',
                'detail': str(exc),
                'status_code': status.HTTP_400_BAD_REQUEST
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    return Response(
        {
            'error': 'Internal server error',
            'detail': str(exc) if context.get('request').user.is_staff else None,
            'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


class BusinessLogicException(Exception):
    pass