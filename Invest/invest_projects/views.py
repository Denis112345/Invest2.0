from django.shortcuts import render, HttpResponse, resolve_url
from .models import Item, Category, ItemImage
from django.http import JsonResponse
from account.models import Profile
from django.db import transaction
from django.contrib.auth.decorators import login_required
from account.models import Profile


def AllInvestProjects(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        return render(request, 'invest_projects/AllInvestProjects.html', {'categories':categories})

def Project(request,project_id):
    if request.method == 'GET':
        try:
            project = Item.objects.get(id=project_id)
            project_creater_profile = Profile.objects.get(user=project.user)
            return render(request, 'invest_projects/InvestProject.html', {'project':project, 'project_creater_profile': project_creater_profile})

        except Item.DoesNotExist: 
            return HttpResponse('<h1 styles="text-align=center">404 Not Found</h1>')

@login_required
@transaction.atomic
def AddProject(request):
    if request.method == 'GET':
        profile = Profile.objects.get(user=request.user)
        categories = Category.objects.all()
        return render(request, 'invest_projects/AddProject.html', {'profile':profile, 'categories':categories})
    
    if request.method == 'POST':
        title = request.POST['title']
        description = request.POST['description']
        city = request.POST['city']
        required_investment = request.POST['required_investment']
        profit_per_month = request.POST['profit_per_month']
        profit_parametr = request.POST['profit_parametr']
        category = Category.objects.first()
        background_image = request.FILES['background_image']
        project_avatar = request.FILES['project_avatar']
        contacts = request.POST['contacts']
        author_job_title = request.POST['author_job_title']
        category = request.POST['category']

        category = Category.objects.get(title=category)
        
        project = Item(
            title=title,
            description=description,
            city=city,
            required_investment=required_investment,
            profit_per_month=profit_per_month,
            profit_parametr=profit_parametr,
            author_job_title=author_job_title,
            contacts=contacts,
            user=request.user,
        )

        project.save()
        project.category.add(category)
        
        project.background_image = background_image
        project.project_avatar = project_avatar
        print(len(request.FILES.getlist('images')))
        for photo in request.FILES.getlist('images'):
            print(len(request.FILES.getlist('images')))
            new_image = ItemImage(item_id=project.id, image=photo)
            new_image.save()
            project.images.add(new_image)

        project.save()

        data = {
            'status': 200,
            'reverse_url': resolve_url(AllInvestProjects)
            # 'reverse_url': resolve_url(Project, project_id=project.id)
        }

        return JsonResponse(data)