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
    @story.stories = Story.all(:id => params[:stories].collect{|i| i.to_i}) if params[:stories]
    @story.maps = Map.all(:id => params[:maps].collect{|i| i.to_i}) if params[:maps]
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
    puts params.inspect
    @story = Story.get(params[:id])
    @story.update(params[:story])
    if params[:stories]
      @story.story_stories.destroy
      Story.all(:id => params[:stories].collect{|i| i.to_i}).each do |s|
        StoryStory.create(:story_id => @story.id, :reminded_of_id => s.id)
      end
    end
    if params[:maps]
      @story.story_maps.destroy
      Map.all(:id => params[:maps].collect{|i| i.to_i}).each do |m|
        StoryMap.create(:story_id => @story.id, :map_id => m.id)
      end 
    end
    if @story.save
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
