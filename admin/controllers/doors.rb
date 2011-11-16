Admin.controllers :doors do

  get :index do
    @doors = Door.all
    render 'doors/index'
  end

  get :new do
    @door = Door.new
    @door.from = Map.first
    @door.to = Map.first
    render 'doors/new'
  end

  post :create do
    @door = Door.new(params[:door])
    
    if @door.save
      flash[:notice] = 'Door was successfully created.'
      redirect url(:doors, :edit, :id => @door.id)
    else
      render 'doors/new'
    end
  end

  get :edit, :with => :id do
    @door = Door.first(:id => params[:id])
    render 'doors/edit'
  end

  put :update, :with => :id do
    @door = Door.first(:id => params[:id])
    if @door.update(params[:door])
      flash[:notice] = 'Door was successfully updated.'
      redirect url(:doors, :edit, :id => @door.id)
    else
      render 'doors/edit'
    end
  end

  delete :destroy, :with => :id do
    door = Door.first(:id => params[:id])
    if door.destroy
      flash[:notice] = 'Door was successfully destroyed.'
    else
      flash[:error] = 'Unable to destroy Door!'
    end
    redirect url(:doors, :index)
  end
end
