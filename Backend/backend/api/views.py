from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .utils import image_to_ascii

class ASCIIConvertView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        image_file = request.FILES.get('image')
        width = int(request.data.get('width', 100))

        if not image_file:
            return Response({"error": "No image uploaded"}, status=400)

        ascii_art = image_to_ascii(image_file.read(), output_width=width)
        return Response({"ascii": ascii_art})

