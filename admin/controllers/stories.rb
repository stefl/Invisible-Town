Admin.controllers :stories do

  get :index do
    @stories = Story.all
    render 'stories/index'
  end

  get :new do
    @story = Story.new
    @story.map = Map.first
    render 'stories/new'
  end

  post :create do
    @story = Story.new(params[:story])
    if @story.save
      flash[:notice] = 'Story was successfully created.'
      redirect url(:stories, :edit, :id => @story.id)
    else
      render 'stories/new'
    end
  end

  get :edit, :with => :id do
    @story = Story.get(params[:id])
    render 'stories/edit'
  end

  put :update, :with => :id do
    @story = Story.get(params[:id])
    if @story.update(params[:story])
      flash[:notice] = 'Story was successfully updated.'
      redirect url(:stories, :edit, :id => @story.id)
    else
      render 'stories/edit'
    end
  end

  delete :destroy, :with => :id do
    story = Story.get(params[:id])
    if story.destroy
      flash[:notice] = 'Story was successfully destroyed.'
    else
      flash[:error] = 'Unable to destroy Story!'
    end
    redirect url(:stories, :index)
  end
end
